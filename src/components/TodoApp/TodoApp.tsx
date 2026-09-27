/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { Loader } from '../Loader';
import { useState } from 'react';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[] | null;
  setTodos: (todos: Todo[]) => void;
  setIsError: (bol: boolean) => void;
  tempTodo: Todo | null;
  isLoading: boolean;
  setIsLoading: (el: boolean) => void;
  isAdding: boolean;
  setIsAdding: (el: boolean) => void;
  statusFilter: string;
  isError: boolean;
  USER_ID: number;
  ErrorMessages: { None: string; Delete: string };
  setErrorMessage: (msg: string) => void;
};

export const TodoApp: React.FC<Props> = ({
  todos,
  setTodos,
  setIsError,
  isLoading,
  setIsLoading,
  statusFilter,
  tempTodo,
  ErrorMessages,
  setErrorMessage,
}) => {
  const filteredTodos = todos?.filter(todo => {
    if (statusFilter === 'completed') {
      return todo.completed;
    }

    if (statusFilter === 'active') {
      return !todo.completed;
    }

    return true;
  });
  const [title, setTitle] = useState('');
  const [deletedId, setDeletedId] = useState(0);

  const removeTodo = async (id: number) => {
    setIsLoading(true);
    try {
      await client.delete(`/todos/${id}`);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setIsError(true);
      setErrorMessage(ErrorMessages.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos &&
        filteredTodos.map(el => {
          return (
            <TodoItem
              todo={el}
              title={title}
              setTitle={setTitle}
              deletedId={deletedId}
              setDeletedId={setDeletedId}
              removeTodo={removeTodo}
              key={el.id}
              el={el}
            />
          );
        })}
      {tempTodo !== null ? (
        <div
          data-cy="Todo"
          className={`todo ${tempTodo.completed ? 'completed' : ''}`}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className={`todo__status ${tempTodo.completed ? 'completed' : ''}`}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
            ×
          </button>

          <Loader isLoading={isLoading} />
        </div>
      ) : (
        ''
      )}
    </section>
  );
};
