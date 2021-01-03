import React from 'react';
import ReactWhatsapp from 'react-whatsapp';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { ITeacher } from '../../../interfaces/ITeacher';
import classes from './WhatsApp.module.scss';

interface Props {
    teacher: ITeacher;
    msgPrefix: string;
    label?: string;
}
export const WhatsApp: React.FC<Props> = ({ teacher, msgPrefix, label }) => (
  <div className={classes.container}>
    <ReactWhatsapp
      number={teacher.phoneChat}
      message={`[${msgPrefix}]:`}
    >
      <div className={classes.body}>
        <WhatsAppIcon />

        {label ?? 'WhatsApp Chat'}

      </div>
    </ReactWhatsapp>
  </div>
);
