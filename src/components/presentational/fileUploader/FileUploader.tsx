import React, {
  forwardRef, useContext, useImperativeHandle, useState,
} from 'react';
import { Button } from '@material-ui/core';
import classes from './FileUploader.module.scss';
import { FileType, uploadFileToServer } from '../../../data/Store';
import { round } from '../../../helper/util';
import { AppContext } from '../../../App';

const ALLOWED_IMAGE_SIZE = 5;
interface Props {
  fileType: FileType;
  fileName: string;
  disabled?: boolean;
  onSuccess?: (fileRef: string | null) => void;
  onCancel?: () => void;
}

const fileFormat = (fileType: FileType): string => {
  switch (fileType) {
    case FileType.IMAGE:
      return 'image/jpeg';
    case FileType.PDF:
      return 'application/pdf';
    case FileType.VIDEO:
      return 'video/mp4';
    default:
      return '';
  }
};

export const FileUploader: React.ForwardRefExoticComponent<Props & React.RefAttributes<unknown>> = forwardRef(
  (props, ref) => {
    const {
      fileType, fileName, onSuccess, onCancel, disabled,
    } = props;
    const [uploadFile, setUploadFile] = useState<File>();
    const [uploadTask, setUploadTask] = useState<any>();
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [busy, setBusy] = useState<boolean>(false);
    // const [downloadUrl, setDownloadUrl] = useState<string>();

    const { showSnackbar, email } = useContext(AppContext);

    const resetFileInput = () => {
    // @ts-ignore
      document.getElementById('uploader').value = null;
      setUploadFile(undefined);
    };

    const onFileSelect = (e: any) => {
    // TODO: Handle if file is not selected from file explorer
      const file: File = e.target.files[0];
      // const videoNode = document.querySelector('video');
      if (file) {
        if (file.type !== fileFormat(fileType)) {
          showSnackbar(`Invalid file type. Please try with: ${fileFormat(fileType)}`);
          return;
        }

        const size = file.size / (1024 * 1024);
        // const fileURL = URL.createObjectURL(file);
        // videoNode.src = fileURL;

        setTimeout(() => {
          // if (fileType === FileType.IMAGE) {
          if (size > ALLOWED_IMAGE_SIZE) {
            showSnackbar(`Maximum ${ALLOWED_IMAGE_SIZE}Mb allowed for 
                    a file. But this file is ${round(size)}Mb`);

            resetFileInput();
          } else {
            // validation success. ready to upload
            setUploadFile(file);
            // setDuration(duration);
          }
        }, 1000);
      }
    };

    const onCancelUpload = () => {
        uploadTask?.cancel();
        setBusy(false);
        if (onCancel) {
          onCancel();
        }
    };

    const uploadAndSave = (email: string, dd: number) => {
      if (!uploadFile) return;

      setUploadProgress(0);
      const out = uploadFileToServer(fileType, uploadFile, email, fileName).subscribe((next) => {
        setUploadTask(next.uploadTask);
        if (next.downloadURL) {
        // upload completed
        // setDownloadUrl(next.downloadURL);
        // onSave(next.downloadURL, `${dd}`, dd, duration);
          out.unsubscribe();
          onSuccess && onSuccess(next.downloadURL);
          setBusy(false);
        }
        if (next.progress < 100) {
          setUploadProgress(next.progress);
        }
      });
    };

    const startUploadFile = () => {
      const dd = new Date().getTime();
      if (!email) {
        showSnackbar('Error with the logged in teacher');
        return;
      }
      // if (!validateLesson()) {
      //   return;d
      // }
      setBusy(true);
      // if (editMode) {
      //   if (uploadFile) {
      //     // deleteVideo(email, videoId).then((data) => console.log('deleted', data));
      //     uploadAndSave(email, dd);
      //   } else {
      //     onSave(videoURL, videoId, dd, duration);
      //   }
      // } else {
      if (uploadFile) {
        uploadAndSave(email, dd);
      } else {
        console.log('Upload file not found');
        onSuccess && onSuccess(null);
        setBusy(false);
      }
    // }
    };

    useImperativeHandle(
      ref,
      () => ({
        startUploading() {
          // alert('Child function called');
          startUploadFile();
        },
      }),
    );

    return (
      <div className={classes.container}>
        <>
          <div className={classes.buttons}>
            <input
              type="file"
              id="uploader"
              name="uploader"
              onChange={onFileSelect}
              disabled={busy || disabled}
            />
            {(uploadProgress > 999 && uploadProgress < 100) && (
              <>
                <span className={classes.progress}>
                  {uploadProgress > 0 && uploadProgress < 100 && `Progress: ${round(uploadProgress)}% `}
                </span>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={onCancelUpload}
                >
                  Cancel Upload
                </Button>
              </>
            )}
          </div>
        </>
      </div>
    );
  },
);
