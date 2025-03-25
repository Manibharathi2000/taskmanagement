import TaskApp from '@/components/TaskManagement/TaskList';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export function HomePage() {
  return (
    <>
      <ColorSchemeToggle />
      <Welcome />
      <TaskApp />
    </>
  );
}
