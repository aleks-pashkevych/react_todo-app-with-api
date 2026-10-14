/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useState, useRef, useEffect } from 'react';
import { useEffect, useState, useRef } from 'react';
import { client } from '../../utils/fetchClient';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/';

type Props = {
  todo: Todo;
  title: string;
  setTitle: (el: string) => void;
  isLoading: boolean;
  onUpdateStatus: (todo: Todo) => Promise<void>;
  // onDelete: (id: number) => Promise<void>;
  deletedId: number | null;
  setDeletedId: (id: number) => void;
  removeTodo: (id: number) => void;
  onToggleStatus: (todo: Todo) => Promise<void>;
  el: Todo;
  loadingTodoIds: number[];
  ErrorMessages: { None: string; Delete: string; Update: string };
  setErrorMessage: (msg: string) => void;
  setIsError: (err: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  title,
  setTitle,
  isLoading,
  onUpdateStatus,
  // onDelete
  removeTodo,
  deletedId,
  setDeletedId,
  el,
  onToggleStatus,
  loadingTodoIds,
  ErrorMessages,
  setErrorMessage,
  setIsError,
}) => {
  const isThisTodoLoading =
    loadingTodoIds.includes(todo.id) || todo.id == deletedId || isLoading;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  const updateTitle = trimmedTitle => {
    client.patch(`/todos/${todo.id}`, { title: trimmedTitle });
  };

  useEffect(() => {
    if (isEditing) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = newTitle.trim();

    setNewTitle(trimmedTitle);

    if (!trimmedTitle) {
      removeTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await updateTitle(trimmedTitle);
      setIsEditing(false);
    } catch {
      setErrorMessage(ErrorMessages.Update);
      setIsError(true);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label
        htmlFor="status"
        className="todo__status-label"
        onClick={() => {
          onUpdateStatus(todo);
        }}
      >
        <input
          id="todo-status"
          data-cy="TodoStatus"
          type="checkbox"
          className={`todo__status ${todo.completed ? 'completed' : ''}`}
          checked={todo.completed}
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            onToggleStatus(todo);
          }}
          onDoubleClick={handleSave}
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
      <Loader isLoading={isThisTodoLoading} />
    </div>
  );
};
