/* eslint-disable jsx-a11y/media-has-caption */
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ReactWhatsapp from 'react-whatsapp';
import classes from './Lesson.module.scss';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { getDocsWithProps, getDocWithId, getVideo } from '../../../../data/Store';
import { ILesson } from '../../../../interfaces/ILesson';
import { ITeacher } from '../../../../interfaces/ITeacher';

export const Lesson: React.FC = () => {
  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [lesson, setLesson] = useState<ILesson>();
  const [vidSrc, setVidSrc] = useState<string | null>(null);

  const processVideo = async () => {
    const lesson = await getDocWithId<ILesson>('lessons', lessonId);

    if (lesson) {
      getDocsWithProps<ITeacher[]>('teachers', { email: lesson.email })
        .then((data) => data && setTeacher(data[0]));
      const url = await getVideo(lesson.email, lesson.videoId);
      setLesson(lesson);
      setVidSrc(url);
    }
  };

  useEffect(() => {
    processVideo();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.topic}>
        {lesson?.topic}
      </div>

      {vidSrc && (
      <video
        width="100%"
        height="100%"
        controls
        controlsList="nodownload"
      >
        <source
          src={vidSrc}
          type="video/mp4"
        />
      </video>
      )}
      {teacher && (
      <div>
        <ReactWhatsapp
          number={teacher.phoneChat}
          message={`[${lesson?.topic}]:`}
        >
          <div>Ask Questions</div>

        </ReactWhatsapp>
      </div>
      )}
      <div className={classes.desc}>
        {lesson?.description}
      </div>
      <div className={classes.attachments}>
        {lesson?.attachments?.map((atta) => (
          <li>
            <a
              href={atta}
              rel="noopener noreferrer"
              target="_blank"
            >
              {atta}
            </a>
          </li>
        ))}
      </div>
    </div>
  );
};
