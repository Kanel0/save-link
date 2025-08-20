import { FourSquare} from 'react-loading-indicators';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
      <FourSquare color="#1a1839" size="medium" text="" textColor="" />
      </div>
    </div>
  );
}