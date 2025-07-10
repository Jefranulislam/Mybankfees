import { useState } from 'react';

const Footer = () => {
  const [formData, setFormData] = useState({ wrongInfo: '', bankName: '', accountType: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentUrl = window.location.href;

    // Send the report to the backend to create a GitHub issue
    try {
      await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, url: currentUrl }),
      });
      alert('Your report has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report. Please try again later.');
    }
  };

  return (
    <footer className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Grid 1: About Creator */}
        <div className="flex flex-wrap items-center justify-center">
          <img
            src="https://avatars.githubusercontent.com/u/75633045?v=4" // Replace with your avatar URL
            alt="Creator Avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          <div className="items-start">
            <h2 className="text-lg font-bold">Know About Developer</h2>
            <p className="mt-2">Hi, I'm Jefranul Islam, the creator of MyBankFees.</p>
            <a
              href="https://github.com/Jefranulislam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mt-2"
            >
              Visit My GitHub
            </a>
          </div>
        </div>

        {/* Grid 2: Disclaimer */}
        <div>
          <h2 className="text-lg font-bold mb-4">Disclaimer</h2>
          <ul className="list-disc pl-5">
            <li>Charges are based on typical usage patterns and may vary.</li>
            <li>Monthly totals include estimated usage of ATM, transfer, and other services.</li>
            <li>Please verify current rates with respective banks before making decisions.</li>
            <li>
              Bangladesh Bank All Schedule of Charges{' '}
              <a
                href="https://www.bb.org.bd/en/index.php/mediaroom/schedule_charges"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                here
              </a>.
            </li>
          </ul>
          <p className="mt-4">
            © 2025 MyBankFees{' '}
            <a
              href="https://github.com/Jefranulislam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              @Jefranul Islam
            </a>. All rights reserved.
          </p>
        </div>

        {/* Grid 3: Report Form */}
        <div>
          <h2 className="text-lg font-bold mb-4">Report Missing/Wrong Information</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="wrongInfo"
              placeholder="What information is wrong?"
              value={formData.wrongInfo}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="bankName"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="accountType"
              placeholder="Account Type"
              value={formData.accountType}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <button type="submit" className="p-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200">
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;