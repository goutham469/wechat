import React, { useEffect, useState } from 'react'
import { API } from '../utils/API'
import { tools } from '../utils/tools'

function Logs() {
    const [logs, setLogs] = useState([])
    const [page, setPage] = useState(0)
    const [selectedLogs, setSelectedLogs] = useState(new Set())
    const [total , setTotal] = useState(NaN)

    useEffect(() => {
        fetchLogs()
    }, [page])

async function fetchLogs()
    {
        try {
            const response = await API.getLogs(page)
            setLogs(response.data?.logs || [])
            setTotal(response.data?.total)
            setSelectedLogs(new Set()) // clear selection on new page
        } catch (err) {
            console.error("Error fetching logs:", err)
        }
    }

    function handlePageChange(change) {
        setPage(prev => (change === '+' ? prev + 1 : Math.max(0, prev - 1)))
    }

    function toggleSelect(id) {
        setSelectedLogs(prev => {
            const newSet = new Set(prev)
            newSet.has(id) ? newSet.delete(id) : newSet.add(id)
            return newSet
        })
    }

    function handleSelectAll(checked) {
        if (checked) {
            setSelectedLogs(new Set(logs.map(log => log.id)))
        } else {
            setSelectedLogs(new Set())
        }
    }

    async function handleDeleteSelected() {
        if (selectedLogs.size === 0) return alert("No logs selected.")

        try {
            console.log(Array.from(selectedLogs));

            await API.deleteLogs(Array.from(selectedLogs))
            fetchLogs()
        } catch (err) {
            console.error("Error deleting selected logs:", err)
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <p>Total : {total}</p>
                <div className="flex items-center gap-2">
                    <button onClick={() => handlePageChange("-")} className="px-2 py-1 bg-gray-300 rounded">&lt;</button>
                    <span>Page: {page}</span>
                    <button onClick={() => handlePageChange("+")} className="px-2 py-1 bg-gray-300 rounded">&gt;</button>
                </div>
                <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete Selected ({selectedLogs.size})
                </button>

                
            </div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        checked={logs.length > 0 && selectedLogs.size === logs.length}
                    />
                    <label className="font-bold">Select All</label>
                </div>
                <div className='h-[90vh] overflow-y-scroll p-2 m-2 rounded-md'>
                    {
                        logs.map((log,idx) => (
                            <Log
                                key={log.id}
                                log={log}
                                idx={idx}
                                isSelected={selectedLogs.has(log.id)}
                                toggleSelect={toggleSelect}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Logs

function Log({ log, isSelected, toggleSelect , idx }) {
    return (
        <div className={`border p-1 mb-2 rounded flex items-center gap-4 ${idx %2 == 0 ? 'bg-stone-300' : 'bg-stone-400' }`}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(log.id)}
            />
            <div className="flex text-around ">
                <p className='text-xs p-2'>{log.id}</p>
                <p className='p-1'><strong>{ tools.convertUTCtoLocalTime( log.time ) }</strong></p>
                <p className='p-1'> {log.ip}</p>
                <p className='p-1' ><strong>msg:</strong> {log.message}</p>
            </div>
        </div>
    )
}
