import React, { useCallback, useEffect, useRef } from 'react';
import {
  Entity, FileType, updateDoc, uploadFileToServer,
} from '../../../data/Store';
import { DEFAULT_FULL_NAME, Util } from '../../../helper/util';
import { IAudioQuestion } from '../../../interfaces/IAudioQuestion';

export interface Props {
  email: string;
  lessonId: string;
}
export const Recorder: React.FC<Props> = ({ email, lessonId }) => {
  const mediaRecorder = useRef<MediaRecorder|undefined>();
  const audioChunks = useRef<any>([]);
  const audioBlob = useRef<any>();

  const initRecorder = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    if (mediaRecorder.current) {
      mediaRecorder.current.addEventListener('dataavailable', (event) => {
        audioChunks.current.push(event.data);
      });

      mediaRecorder.current.addEventListener('stop', () => {
        audioBlob.current = new Blob(audioChunks.current);
        const audioUrl = URL.createObjectURL(audioBlob.current);
        const audio = new Audio(audioUrl);
        audio.play();
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
      mediaRecorder.current.start();
    }
  };
  const handleStopRecord = () => {
    console.log('Stop');
    mediaRecorder.current?.stop();
  };

  const handleSend = () => {
    const timestamp = new Date().getTime().toString();

    uploadFileToServer(FileType.AUDIO, audioBlob.current, email, timestamp).subscribe((data) => {
      if (data.downloadURL) {
        console.log(data.downloadURL);
        const question: Record<string, IAudioQuestion> = {
          [`audioQuestions.${timestamp}`]: {
            questionURL: data.downloadURL,
            studentName: Util.fullName !== DEFAULT_FULL_NAME ? Util.fullName : email,
          },
        };
        updateDoc(Entity.LESSONS_LIVE, lessonId, question).then(() => {
          console.log('Lesson Updated');
        });
      }
    });
  };

  return (
    <div>
      Recorder
      <button
        type="button"
        onClick={handleStartRecord}
      >
        Start Record
      </button>
      <button
        type="button"
        onClick={handleStopRecord}
      >
        Stop Record
      </button>

      <button
        type="button"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
