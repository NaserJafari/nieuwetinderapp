import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Tinder</h1>
        <p className="text-gray-500 mb-6">Welcome to Tinder</p>
        <div className="flex justify-center">
          <Link
            to="/register"
            className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 mb-4"
          >
            Register
          </Link>
        </div>
        <div className="flex justify-center">
          <p className="text-gray-500">Already have an account?</p>
          <Link
            to="/login"
            className="ml-2 text-blue-500 hover:underline"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
