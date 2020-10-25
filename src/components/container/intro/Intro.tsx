import React from 'react';
import { useParams } from 'react-router-dom';
import classes from './Intro.module.scss';
import imgDash from '../../../images/ssDashboard.png';
import imgSubs from '../../../images/ssSubscriptions.png';

export const Intro: React.FC = () => {
  const { id } = useParams<any>();

  return (
    <div className={classes.container}>
      <h2>Introduction</h2>
      <div>
        <p>
          Akshara.lk හරහා ඕනෑම ගුරුවරයෙකුට තමන්ගේම  උපකාරක පන්තියක් පවත්වාගෙන යා හැකිය.
          මෙහිදී ගුරවරයා විසින් record කරන ලද video files
          අපගේ
          වෙබ් අඩවියට upload කල යුතු අතර
          සිසුන් විසින්  මේවා එකින් එක නැරඹිය හැකිය.
        </p>
        <p>
          <b>Free Videos:</b>
          <br />
          ඕනෑම සිසුවෙකුට මෙම video නැරඹිය හැකිය. කිසිදු ගෙවීමක් අවශ්‍ය නොවේ.
          (ගුරුවරුන් විසින් තමන්ගේ පාඨමාලාව පිලිබඳ සාරාංශයක් ඉතා ආකර්ශනීය ලෙස මෙමගින්  upload කල හැකිය.)
        </p>
        <p>
          <b>Paid Videos:</b>
          <br />
          මෙම video නැරඹීමට නම් අපගේ වෙබ් අඩවියට online ගෙවීමක් සිදුකල යුතුය. එක් මුදල් ගෙවීමක් සදහා දෙවරක් video එකක් සිසුන්ට නැරඹිය හැකිය. Video එකෙහි අන්තර්ගතය හා
          කාලය අනුව ගෙවිය යුතු මුදල ගුරුවරයාට තනිවම  ඇතුලත්  කල හැකිය. සෑම  මසකම අවසානයේ
          ගුරුවරයාගේ මුදල  ඔහුගේ බැංකු ගිණුමට බැර වේ.
        </p>
        <ul>
          <li>
            Upload  කරන video තමන්ට සරිලන පරිදි  කුඩා කුඩා video ලෙසද upload කල හැකිය.
            (එවිට අඩු මිල ගණන් යටතේ video ළමුන්ට ලබා දිය හැකිය.)
          </li>
          <li>
            කිසිදු ආකාරයකින් මෙම video share කල නොහැකි අතර සෑම දර්ශන වාරයක් සඳහාම
            ගුරුවරයාට මුදල් ලැබෙන බව අපට සහතික කල හැකිය.
          </li>
          <li>
            සෑම ගුරුවරයෙක් සඳහාම තමන්ගේම profile එකක්( Eg: http://akshara.lk/teacher/123 )
            ලැබෙන අතර  ගුරුවරුන්ට තමන්ට ගැලපෙන අකාරයකට ඉහත link එක share කිරීමෙන් සිසුන් ගණන වැඩිකළ ගත හැකිය.
          </li>
        </ul>
        <p />
        <p>
          <b>තමන්ගේ video සඳහා ළමුන් කළ ගෙවීම් ප්‍රමාණය තම දුරකතනයෙන් වුවද බලා ගත හැකිය</b>
          <img
            className={classes.ss}
            style={{ maxWidth: '300px' }}
            src={imgSubs}
            alt="Subscriptions"
          />
        </p>
        <p>
          <b>ගුරුවරයාගේ video තමන්ට පහසු පරිදි කළමනාකරණය කිරීමේ හැකියාව ඇත</b>
          <img
            className={classes.ss}
            src={imgDash}
            alt="Dashboard"
          />
        </p>
        { id === '1' ? (
          <p>
            <b>More details:</b>
            <a
              href="tel:0716151541"
              className={classes.link}
            >
              0716151541
            </a>
          </p>
        ) : (
          <p>
            <b>More details:</b>
            <a
              href="tel:0771141194"
              className={classes.link}
            >
              0771141194
            </a>
          </p>
        )}
      </div>
    </div>
  );
};
