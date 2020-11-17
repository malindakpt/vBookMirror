import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../../App';
import Config from '../../../../data/Config';
import { Entity, getDocsWithProps, getDocWithId } from '../../../../data/Store';
import { promptPayment, Util } from '../../../../helper/util';
import { useBreadcrumb } from '../../../../hooks/useBreadcrumb';
import { IPaper } from '../../../../interfaces/ILesson';
import { IPayment, PaymentType } from '../../../../interfaces/IPayment';
import { ITeacher } from '../../../../interfaces/ITeacher';
import { PDFView } from '../../../presentational/pdfView/PDFView';

export const MCQPaper = () => {
  const { email, showSnackbar } = useContext(AppContext);
  // disble context menu for avoid right click
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  useBreadcrumb();
  const { lessonId } = useParams<any>();
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [paper, setPaper] = useState<IPaper>();
  const [freeOrPurchased, setFreeOrPurchased] = useState<boolean>();

  const processPaper = async () => {
    getDocWithId<IPaper>(Entity.PAPER_MCQ, lessonId).then((paper) => {
      if (!paper) return;

      // Fetch techer for show teache info and check is this running lesson ID
      getDocWithId<ITeacher>(Entity.TEACHERS, paper.ownerEmail).then((teacher) => {
        teacher && setTeacher(teacher);

        if (paper.price) {
          if (email) {
            getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS,
              { lessonId, ownerEmail: email }).then((data) => {
            // TODO:  Check refundable lessons here
              if (data && data.length > 0) {
                setPaper(paper);
                setFreeOrPurchased(true);
              } else {
                teacher && promptPayment(email, teacher, paper, PaymentType.MCQ_PAPER,
                  () => {
                    setTimeout(() => {
                      window.location.reload();
                    }, Config.realoadTimeoutAferSuccessPay);
                  }, showSnackbar);
              }
            });
          } else {
            showSnackbar('Please login with your Gmail address');
            Util.invokeLogin();
          }
        } else {
          setPaper(paper);
          setFreeOrPurchased(true);
        }
      });
    });
  };

  useEffect(() => {
    processPaper();
  }, []);

  return (
    <div>
      {paper ? (
        <div>
          <div>{paper.topic}</div>
          <div>{paper.description}</div>
          <PDFView url={paper.pdfURL} />
        </div>
      ) : <div>Not Loaded</div>}
    </div>
  );
};
