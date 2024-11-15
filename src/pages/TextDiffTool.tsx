import React, { useState } from "react";
import { diffWords } from "diff";
import { ArrowLeftRight, Copy, Trash2, Wand2 } from "lucide-react";

const TextDiffTool = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<Array<{ value: string; added?: boolean; removed?: boolean }>>([]);
  const [showDiff, setShowDiff] = useState(false);

  const handleCompare = () => {
    const diff = diffWords(text1, text2);
    setDiffResult(diff);
    setShowDiff(true);
  };

  const clearAll = () => {
    setText1("");
    setText2("");
    setDiffResult([]);
    setShowDiff(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Text Difference Analyzer
          </h1>
          <p className="mt-3 text-gray-400">Compare and analyze text differences with precision</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Original Text</label>
              <div className="space-x-2">
                <button
                  onClick={() => copyToClipboard(text1)}
                  className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Copy text"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => setText1("")}
                  className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Clear text"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter your original text here..."
              className="w-full h-64 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Modified Text</label>
              <div className="space-x-2">
                <button
                  onClick={() => copyToClipboard(text2)}
                  className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Copy text"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => setText2("")}
                  className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Clear text"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter your modified text here..."
              className="w-full h-64 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none resize-none font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleCompare}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg font-medium flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <ArrowLeftRight size={20} />
            Compare Texts
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            <Trash2 size={20} />
            Clear All
          </button>
        </div>

        {showDiff && (
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wand2 className="text-blue-400" />
              Difference Analysis
            </h2>
            <div className="prose prose-invert max-w-none">
              <div className="font-mono text-sm leading-relaxed">
                {diffResult.map((part, i) => (
                  <span
                    key={i}
                    className={`${
                      part.added
                        ? "bg-emerald-500/20 text-emerald-300"
                        : part.removed
                        ? "bg-rose-500/20 text-rose-300"
                        : "text-gray-300"
                    } px-1 rounded`}
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextDiffTool;