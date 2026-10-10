export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          <p className="mt-1 text-sm text-gray-500">Update your account's profile information and email address.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" defaultValue="Jane Smith" className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 max-w-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" defaultValue="jane@example.com" className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 max-w-md" />
          </div>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
