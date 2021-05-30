import React, { useCallback, useEffect, useRef } from 'react';
import { FileType, uploadFileToServer } from '../../../data/Store';

export const Recorder: React.FC = () => {
  const mediaRecorder = useRef<MediaRecorder|undefined>();

  const initRecorder = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
  }, []);

  useEffect(() => {
    initRecorder();
  }, [initRecorder]);

  const handleStartRecord = () => {
    console.log('Start');

    const audioChunks: any = [];

    if (mediaRecorder.current) {
      mediaRecorder.current.start();

      mediaRecorder.current.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();

        uploadFileToServer(FileType.AUDIO, audioBlob, 'voice', '123').subscribe((data) => {
          console.log(data);
        });
      });
    }
  };
  const handleStopRecord = () => {
    console.log('Stop');
    mediaRecorder.current?.stop();
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
    </div>
  );
};
