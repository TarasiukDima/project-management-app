import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import LightBox from '$components/Lightbox';
import UpdateTaskForm, { IUpdateTaskFormProps } from './UpdateTaskForm';
import UpdateTaskContent from './UpdateTaskContent';
import { TSimpleFunction } from '$types/common';

interface IBoardsModal extends IUpdateTaskFormProps {
  showModal: boolean;
  showLikeForm: boolean;
  showForm: TSimpleFunction;
  responsibleUser: string;
  closeModal: TSimpleFunction;
}

const LightboxTask: FC<IBoardsModal> = ({
  showModal,
  isLoading,
  responsibleUser,
  showLikeForm,
  showForm,
  closeModal,
  defaultFormState,
  submitCB,
  users,
}) => {
  const { t } = useTranslation();
  const modalTitle = showLikeForm
    ? t('Tasks.updateLikeFormModalTitle')
    : t('Tasks.updateModalTitle', { TASK_NAME: defaultFormState.title });

  return (
    <LightBox showModal={showModal} closeModalFunction={closeModal} modalTitle={modalTitle}>
      {showLikeForm ? (
        <UpdateTaskForm
          isLoading={isLoading}
          defaultFormState={defaultFormState}
          users={users}
          submitCB={submitCB}
        />
      ) : (
        <UpdateTaskContent
          description={defaultFormState.description}
          responsibleUser={responsibleUser}
          showForm={showForm}
        />
      )}
    </LightBox>
  );
};

export default LightboxTask;
