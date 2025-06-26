import React from 'react';
import { toast } from 'react-toastify';
import { API } from '../utils/API';

function SqlEditor() {
    const [form, setForm] = React.useState({});
    const [result, setResult] = React.useState([]);

    async function submit(e) {
        e.preventDefault();

        try {
            const response = await API.SQLQuery(form);

            if (response.success) {
                console.log(response.data);
                setResult(response.data.result || []);
            } else {
                toast.error("An error occurred...");
                console.error(response.error);
            }
        } catch (err) {
            toast.error("Failed to run query.");
            console.error(err);
        }
    }

    return (
        <div className="p-6 max-w-8xl mx-auto">
            <form
                onSubmit={submit}
                className="flex flex-col space-y-4 bg-white shadow-md rounded-xl p-6"
            >
                <label className="text-lg font-semibold text-gray-700">
                    SQL Query
                </label>
                <textarea
                    className="w-180 h-60 p-2 border border-gray-300 resize-none focus:outline-none bg-stone-600 text-orange-50"
                    placeholder="Enter your SQL query here..."
                    onChange={(e) => setForm({ query: e.target.value })}
                />
                <button
                    type="submit"
                    className="w-max px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Run Query
                </button>
            </form>

            <div className="mt-8">
                {Array.isArray(result) && result.length > 0 ? (
                    <div className="space-y-1">
                        {result.map((record, idx) => (
                            <div
                                key={idx}
                                className="p-1 bg-gray-100 rounded-lg shadow-sm"
                            >
                                <p className="text-[10px] text-gray-500">Row {idx + 1}</p>
                                <pre className="text-sm font-mono text-gray-800">
                                    {JSON.stringify(record, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No results to show.</p>
                )}
            </div>
        </div>
    );
}

export default SqlEditor;