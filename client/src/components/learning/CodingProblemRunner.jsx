import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, ChevronLeft, Loader, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import './CodingProblemRunner.css';

const languages = [
    { id: 'python', name: 'Python', defaultCode: 'def solve():\n    print("Hello World")' },
    { id: 'javascript', name: 'JavaScript', defaultCode: 'console.log("Hello World");' },
    { id: 'java', name: 'Java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}' },
    { id: 'cpp', name: 'C++', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World";\n    return 0;\n}' }
];

const CodingProblemRunner = ({ problemId, onExit }) => {
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState(null); // { stdout, stderr }
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [activeTab, setActiveTab] = useState('description'); // description, output

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/coding-problems/${problemId}`);
                setProblem(res.data);
                
                // Set starter code if available
                if (res.data.starterCode && res.data.starterCode[language]) {
                    setCode(res.data.starterCode[language]);
                } else {
                    setCode(languages.find(l => l.id === language)?.defaultCode || '');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemId]);

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        if (problem?.starterCode && problem.starterCode[newLang]) {
            setCode(problem.starterCode[newLang]);
        } else {
            setCode(languages.find(l => l.id === newLang)?.defaultCode || '');
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setActiveTab('output');
        setTestResults(null); 
        setOutput(null);

        try {
            const res = await axios.post(`${API_URL}/api/coding-problems/execute`, {
                language,
                sourceCode: code,
                stdin: problem.examples && problem.examples.length > 0 ? problem.testCases[0]?.input : ''
            });

            const run = res.data.run;
            setOutput({
                stdout: run.stdout,
                stderr: run.stderr,
                code: run.code
            });
        } catch (err) {
            setOutput({ stderr: 'Network or Server Error: ' + err.message });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        setActiveTab('output');
        setTestResults(null);
        setOutput(null);

        try {
            const res = await axios.post(`${API_URL}/api/coding-problems/submit`, {
                problemId,
                language,
                sourceCode: code
            });
            setTestResults(res.data);
        } catch (err) {
            setOutput({ stderr: 'Submission Error: ' + err.message });
        } finally {
            setIsRunning(false);
        }
    };

    if (loading) return <div className="loading-screen"><Loader className="spinner" /></div>;
    if (!problem) return <div className="error-message">Problem not found</div>;

    const getDifficultyClass = (diff) => {
        switch(diff) {
            case 'Easy': return 'difficulty-easy';
            case 'Medium': return 'difficulty-medium';
            case 'Hard': return 'difficulty-hard';
            default: return '';
        }
    };

    return (
        <div className="runner-container">
            {/* Header */}
            <div className="runner-header">
                <div className="runner-header-left">
                    <button onClick={onExit} className="back-button">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="problem-title-group">
                        <h2>
                            {problem.title} 
                            <span className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>
                                {problem.difficulty}
                            </span>
                        </h2>
                    </div>
                </div>

                <div className="runner-header-right">
                     <select 
                        className="language-select"
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                        {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>

                    <button 
                        onClick={handleRun}
                        disabled={isRunning}
                        className="btn-run"
                    >
                        <Play size={16} />
                        Run
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isRunning}
                        className="btn-submit"
                    >
                        {isRunning ? <Loader size={16} className="spinner-sm" /> : <Send size={16} />}
                        Submit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="runner-body">
                {/* Left Panel: Description */}
                <div className="left-panel">
                     <div className="panel-content custom-scrollbar">
                        <h3 className="section-title">Description</h3>
                        <div className="prose">
                            {problem.description}
                        </div>

                        {problem.examples && problem.examples.length > 0 && (
                            <div className="examples-section">
                                <h4>Examples:</h4>
                                {problem.examples.map((ex, i) => (
                                    <div key={i} className="example-card">
                                        <div>
                                            <strong>Input:</strong> {ex.input}
                                        </div>
                                        <div>
                                            <strong>Output:</strong> {ex.output}
                                        </div>
                                        {ex.explanation && (
                                            <div className="explanation">
                                                Explanation: {ex.explanation}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {problem.constraints && (
                             <div className="constraints-section">
                                <h4>Constraints:</h4>
                                <div className="constraints-box">
                                    <ul>
                                        {problem.constraints.split('\n').map((c, i) => <li key={i}>{c}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                     </div>
                </div>

                {/* Right Panel: Editor & Output */}
                <div className="right-panel">
                    {/* Editor */}
                    <div className="editor-wrapper">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value)}
                            theme="light" 
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 10 }
                            }}
                        />
                    </div>

                    {/* Output Panel */}
                    <div className="output-panel">
                        <div className="output-tabs">
                            <button 
                                className={`tab-btn ${activeTab === 'output' ? 'active' : ''}`}
                                onClick={() => setActiveTab('output')}
                            >
                                Output
                            </button>
                             <button 
                                className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                                onClick={() => setActiveTab('results')}
                            >
                                Test Results
                            </button>
                        </div>
                        
                        <div className="output-content custom-scrollbar">
                            {activeTab === 'output' && (
                                <div>
                                    {output ? (
                                        <>
                                            {output.stderr && (
                                                <div className="error-box">
                                                    <strong>Error:</strong>
                                                    <pre>{output.stderr}</pre>
                                                </div>
                                            )}
                                            {output.stdout && (
                                                <div className="stdout-box">
                                                    <div className="label">Standard Output</div>
                                                    <pre>{output.stdout}</pre>
                                                </div>
                                            )}
                                            {!output.stdout && !output.stderr && !isRunning && (
                                                <div className="empty-state">No output</div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="empty-state">Run code to see output...</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'results' && (
                                <div>
                                    {testResults ? (
                                        <div className="results-wrapper">
                                            <div className={testResults.allPassed ? 'success-badge' : 'failure-badge'}>
                                                {testResults.allPassed ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                                <span>{testResults.allPassed ? 'Accepted' : 'Wrong Answer'}</span>
                                            </div>

                                            <div className="test-cases-list">
                                                {testResults.results.map((result, i) => (
                                                    <div key={i} className={`test-case-item ${result.passed ? 'passed' : 'failed'}`}>
                                                        <div className="test-case-header">
                                                            <span>Test Case {i + 1}</span>
                                                            <span style={{ color: result.passed ? '#10b981' : '#ef4444' }}>
                                                                {result.passed ? 'Passed' : 'Failed'}
                                                            </span>
                                                        </div>
                                                        <div className="test-case-details">
                                                            <div className="detail-row">
                                                                <span className="label">Input:</span>
                                                                <span className="code-block">{result.input}</span>
                                                            </div>
                                                             {!result.passed && (
                                                                <div className="detail-row">
                                                                    <span className="label">Expected:</span>
                                                                    <span className="code-block">{result.expectedOutput}</span>
                                                                </div>
                                                             )}
                                                        </div>
                                                         {!result.passed && (
                                                            <div className="error-output">
                                                                <span className="label">Your Output:</span>
                                                                <pre>{result.actualOutput || (result.error ? result.error : '(No Output)')}</pre>
                                                            </div>
                                                         )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state">Submit code to see test results...</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingProblemRunner;
