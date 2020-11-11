import { Button } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import classes from './FileUploader.module.scss';
import { FileType, uploadFileToServer } from '../../../data/Store';
import { round } from '../../../helper/util';
import { AppContext } from '../../../App';

const ALLOWED_IMAGE_SIZE = 5;
interface Props {
  fileType: FileType;
  fileName: string;
  onSuccess: (fileRef: string) => void;
  onCancel?: () => void;
}
export const FileUploader: React.FC<Props> = ({
  fileType, fileName, onSuccess, onCancel,
}) => {
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

    // const videoNode = document.querySelector('video');
    // if (videoNode) videoNode.src = '';
  };

  const onFileSelect = (e: any) => {
    // TODO: Handle if file is not selected from file explorer
    const file: File = e.target.files[0];
    // const videoNode = document.querySelector('video');

    // if (file.type === 'video/mp4') {
    if (file) {
      const size = file.size / (1024 * 1024);
      // const fileURL = URL.createObjectURL(file);
      // videoNode.src = fileURL;

      setTimeout(() => {
        if (fileType === FileType.IMAGE) {
          if (size > ALLOWED_IMAGE_SIZE) {
            showSnackbar(`Maximum ${ALLOWED_IMAGE_SIZE}Mb allowed for 
                    an image. But this file is ${round(size)}Mb`);

            resetFileInput();
          } else {
            // validation success. ready to upload
            setUploadFile(file);
            // setDuration(duration);
          }
        } else {
          // const duration = round(videoNode.duration / 60);
          // const uploadedSizePer1min = (size / duration);
          // if (uploadedSizePer1min > ALLOWED_SIZE_FOR_MIN) {
          //   const allowedSize = round(ALLOWED_SIZE_FOR_MIN * duration);
          //   showSnackbar(`Maximum ${allowedSize}Mb allowed for
          //         ${duration} minutes video. But this file is ${round(size)}Mb`);

          //   resetFileInput();
          // } else if (size > 600) {
          //   showSnackbar('Error: Maximum file size is 600Mb');
          //   resetFileInput();
          // } else {
          // // validation success. ready to upload
          //   setUploadFile(file);
          //   setDuration(duration);
          // }
        }
      }, 1000);
    }
    // } else {
    //   showSnackbar('Please choose an .mp4 file');
    //   resetFileInput();
    // }
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
    const out = uploadFileToServer(FileType.IMAGE, uploadFile, email, fileName).subscribe((next) => {
      setUploadTask(next.uploadTask);
      if (next.downloadURL) {
        // upload completed
        // setDownloadUrl(next.downloadURL);
        // onSave(next.downloadURL, `${dd}`, dd, duration);
        out.unsubscribe();
        onSuccess(next.downloadURL);
        setBusy(false);
      }
      if (next.progress < 100) {
        setUploadProgress(next.progress);
      }
    });
  };

  const startUploadFile = (e: any) => {
    const dd = new Date().getTime();
    if (!email) {
      showSnackbar('Error with the logged in teacher');
      return;
    }
    // if (!validateLesson()) {
    //   return;
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
      showSnackbar('Upload file not found');
      setBusy(false);
    }
    // }
  };

  return (
    <div className={classes.container}>
      <>
        <div className={classes.buttons}>
          <input
            type="file"
            id="uploader"
            name="uploader"
            onChange={onFileSelect}
            disabled={busy}
          />
          {uploadProgress > 0 && uploadProgress < 100 ? (
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
          ) : (
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={startUploadFile}
            >
              Start Upload
              {`  ${fileName}`}
            </Button>
          )}
        </div>
        {/* <video
          id="myVideo"
          width="320"
          height="176"
          controls
          controlsList="nodownload"
          src={AKSHARA_HELP_VIDEO}
        >
          <track
            kind="captions"
          />
        </video> */}
      </>
    </div>
  );
};
