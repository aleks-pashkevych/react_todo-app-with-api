import React, { useEffect, useRef, useState } from 'react';
import { client } from '../../utils/fetchClient';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: (el: Todo | null) => void;
  isLoading: boolean;
  setIsLoading: (el: boolean) => void;
  isAdding: boolean;
  setIsAdding: (el: boolean) => void;
  statusFilter: string;
  isError: boolean;
  setIsError: (el: boolean) => void;
  setErrorMessage: (el: string) => void;
  USER_ID: number;
  createCallback: () => void;
  ErrorMessages: {
    None: string;
    Load: string;
    Empty: string;
    Add: string;
    Delete: string;
    Update: string;
  };
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setTempTodo,
  isLoading,
  setIsLoading,
  isAdding,
  setIsAdding,
  setIsError,
  setErrorMessage,
  USER_ID,
  ErrorMessages,
}) => {
  const [title, setTitle] = useState('');
  const allCompleted = todos?.every(todo => todo.completed) || false;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isAdding, isLoading, todos]);

  const addTodo = async () => {
    const trimmedTitle = title.trim();

    setErrorMessage('');

    if (!trimmedTitle) {
      setIsError(true);
      setErrorMessage(ErrorMessages.Empty);
      inputRef.current?.focus();

      return;
    }

    setIsError(false);
    setIsLoading(true);
    setIsAdding(true);

    const el = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    try {
      const createdTodo: Todo = await client.post(`/todos`, el);

      // setTempTodo(createdTodo);
      setTodos(prevTodos =>
        prevTodos ? [...prevTodos, createdTodo] : [createdTodo],
      );
      setTempTodo(null);
      setTitle('');
      // createCallback();
      // return createdTodo;
    } catch {
      setIsError(true);
      setTempTodo(null);
      setErrorMessage(ErrorMessages.Add);
      // throw new Error(ErrorMessages.Add);
    } finally {
      // setIsFocused(true);
      setIsLoading(false);
      setIsAdding(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const createTempTodo = () => {
    const tempTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    if (todos) {
      setTempTodo(tempTodo);
    }
  };

  const toggleTodos = () => {
    let revCompl = false;

    setIsLoading(true);

    if (todos?.every(todo => todo.completed === true)) {
      revCompl = false;
    } else {
      revCompl = true;
    }

    try {
      Promise.all(
        todos.map(el => {
          client.patch(`/todos/${el.id}`, { completed: revCompl });
        }),
      );
      setTodos(prev => prev.map(todo => ({ ...todo, completed: revCompl })));
    } catch {
      // error handling
    } finally {
      setIsLoading(false);
    }

    setTodos(prev => prev.map(todo => ({ ...todo, completed: revCompl })));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted}`}
        data-cy="ToggleAllButton"
        onClick={toggleTodos}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={async event => {
          event.preventDefault();
          createTempTodo();
          await addTodo();
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading || isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
