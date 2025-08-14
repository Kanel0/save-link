import { FourSquare} from 'react-loading-indicators';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
      <FourSquare color="#5d747f" size="medium" text="" textColor="" />
      </div>
    </div>
  );
}