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
          Akshara.lk හරහා ඕනෑම ගුරුවරයෙකුට තමන්ගේ online උපකාරක පන්ති, තමන්ගේම වෙබ් අඩවියක් ලෙස පවත්වාගෙන යා හැකිය.
          <br />
          මෙහිදී කිසිදු අතරමැදියෙක් නොමැතිව ගුරවරයා හා සිසුවන් සම්බන්ද වන අතර ගුරුවරයාට තමන්ගේ videos හෝ  live  lessons වල පාලනය  100%ක්ම  හිමිවේ.
          සිසුන්ට online ගෙවීම් කල හැකි නිසා ගුරුවරයාට ඒ  පිළිබඳව කිසිදු ගැටළුවක් ඇති නොවේ.
        </p>
        <p>
          <b>Live Lessons:</b>
          <br />
          සිසුන්ට මෙම පාඩම්  සඳහා සම්බන්ද වන්නේ ඔබගේ  වෙබ් අඩවිය හරහා වන අතර මේවා නොමිලේ හෝ  මුදල් ගෙවිය යුතු ලෙස වර්ග  කළ  හැකිය.
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
          මෙම video නැරඹීමට නම් ඔබගේ වෙබ් අඩවියට online ගෙවීමක් සිදුකල යුතුය. එක් මුදල් ගෙවීමක් සදහා දෙවරක් video එකක් සිසුන්ට නැරඹිය හැකිය. Video එකෙහි අන්තර්ගතය හා
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
            සෑම ගුරුවරයෙක් සඳහාම තමන්ගේම වෙබ් අඩවියක්
            ලැබෙන අතර  ගුරුවරුන්ට තමන්ට ගැලපෙන අකාරයකට එම  link එක share කිරීමෙන් සිසුන් ගණන වැඩිකළ ගත හැකිය.
          </li>
        </ul>
        <p />
        {/* <p>
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
        </p> */}
        <p>
          ගුරුවරයාගෙන් මේ සඳහා කිසිදු ගාස්තුවක් ය නොකරන අතර  එක්  online ගෙවීමක්  සඳහා 15% ක මුදලක්  පාඩමේ මිලට අමතරව සේවා ගාස්තුවක් ලෙස සිසුන් විසින් ගෙවිය  යුතුය.
        </p>
        <p>
          <b>For More details:</b>
          <a
            href="tel:0771141194"
            className={classes.link}
          >
            0771141194
          </a>
        </p>

        <p>
          <b>For More details:</b>
          <a
            href="tel:0716151541"
            className={classes.link}
          >
            0716151541
          </a>
        </p>

      </div>
    </div>
  );
};
