/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/';

type Props = {
  todo: Todo;
  title: string;
  setTitle: (el: string) => void;
  isLoading: boolean;
  onUpdate: (todo: Todo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  deletedId: number;
  setDeletedId: (id: number) => void;
  removeTodo: (id: number) => void;
  el: Todo;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  title,
  setTitle,
  // isLoading,
  // onUpdate,
  // onDelete
  removeTodo,
  deletedId,
  setDeletedId,
  el,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label htmlFor="status" className="todo__status-label">
        <input
          id="todo-status"
          data-cy="TodoStatus"
          type="checkbox"
          className={`todo__status ${todo.completed ? 'completed' : ''}`}
          checked={todo.completed}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title" id="todo-title">
        {todo.title}
      </span>
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setDeletedId(el.id);
          removeTodo(el.id);
        }}
      >
        ×
      </button>
      <Loader isLoading={todo.id === deletedId} />
    </div>
  );
};
