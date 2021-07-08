import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import SettingsVoiceIcon from '@material-ui/icons/SettingsVoice';
import StopIcon from '@material-ui/icons/Stop';
import SendIcon from '@material-ui/icons/Send';
import {
  Entity, FileType, updateDoc, uploadFileToServer,
} from '../../../data/Store';
import { DEFAULT_FULL_NAME, Util } from '../../../helper/util';
import { IQuestion } from '../../../interfaces/IQuestion';
import classes from './Recorder.module.scss';
import { AppContext } from '../../../App';

enum RecordingStatus {
  Default,
  Recording,
  Recorded,
  Sending
}
export interface Props {
  email: string;
  lessonId: string;
}
export const Recorder: React.FC<Props> = ({ email, lessonId }) => {
  const { showSnackbar } = useContext(AppContext);
  const mediaRecorder = useRef<MediaRecorder | undefined>();
  const audioChunks = useRef<any>([]);
  const audioBlob = useRef<any>();
  // const audioFile = useRef<HTMLAudioElement>();
  const [status, setStatus] = useState<RecordingStatus>(RecordingStatus.Default);

  const initRecorder = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    if (mediaRecorder.current) {
      mediaRecorder.current.addEventListener('dataavailable', (event) => {
        audioChunks.current.push(event.data);
      });

      mediaRecorder.current.addEventListener('stop', () => {
        audioBlob.current = new Blob(audioChunks.current);
        // const audioUrl = URL.createObjectURL(audioBlob.current);
        // const audio = new Audio(audioUrl);
        // audio.play();
      });
    }
  }, []);

  useEffect(() => {
    initRecorder();
  }, [initRecorder]);

  const handleStartRecord = () => {
    console.log('Start');

    audioChunks.current = [];

    if (mediaRecorder.current) {
      showSnackbar('ප්‍රශ්නය පටිගත වීම ආරම්භ විය ');
      mediaRecorder.current.start();
      setStatus(RecordingStatus.Recording);
    }
  };
  const handleStopRecord = () => {
    console.log('Stop');
    mediaRecorder.current?.stop();
    setStatus(RecordingStatus.Recorded);
    showSnackbar('පටිගත වීම අවසන්. ගුරුවරයා වෙත යැවීමට send මත click කරන්න.');
  };

  // const preview = () => {
  //   console.log('Preview');
  //   const audioUrl = URL.createObjectURL(audioBlob.current);
  //   audioFile.current = new Audio(audioUrl);
  //   audioFile.current.play();
  // };

  // const stopPlay = () => {
  //   console.log('stopPlay');
  //   audioFile.current?.pause();
  // };

  const handleSend = () => {
    setStatus(RecordingStatus.Sending);
    showSnackbar('ගුරුවරයා වෙත යවමින් පවතී...');
    const timestamp = new Date().getTime().toString();

    uploadFileToServer(FileType.AUDIO, audioBlob.current, email, timestamp).subscribe((data) => {
      if (data.downloadURL) {
        console.log(data.downloadURL);
        const question: Record<string, IQuestion> = {
          [`questions.${timestamp}`]: {
            audioURL: data.downloadURL,
            questionText: null,
            studentName: Util.fullName !== DEFAULT_FULL_NAME ? Util.fullName : email,
          },
        };
        updateDoc(Entity.LESSONS_LIVE, lessonId, question).then(() => {
          console.log('Lesson Updated');
          setStatus(RecordingStatus.Default);
          showSnackbar('ගුරුවරයා වෙත යැවීම සාර්ථකයි ');
        });
      }
    });
  };

  return (
    <div className={classes.container}>

      {(status === RecordingStatus.Default || status === RecordingStatus.Recorded) && (
        <SettingsVoiceIcon onClick={handleStartRecord} />
      )}

      {status === RecordingStatus.Recording && (
        <StopIcon onClick={handleStopRecord} />
      )}

      {status === RecordingStatus.Recorded && (
        <SendIcon onClick={handleSend} />
      )}
    </div>
  );
};
