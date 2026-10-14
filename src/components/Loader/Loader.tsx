import React from 'react';
// import classNames  'classnames';

type Props = {
  isLoading?: boolean;
};
export const Loader: React.FC<Props> = ({ isLoading }) => {
  // console.log('Loader');

  return (
    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      // className={classNames('modal', 'overlay', { 'is-active': isLoading })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
