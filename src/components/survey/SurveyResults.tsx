import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { availableSurveys, getSurveyResultsKey } from '../../data/survey-json';

interface SurveyResult {
  id: number;
  timestamp: string;
  surveyId: string;
  surveyTitle: string;
  [key: string]: unknown;
}

export default function SurveyResults() {
  const [results, setResults] = useState<Record<string, SurveyResult[]>>({});
  const [selectedSurvey, setSelectedSurvey] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<string>('');

  // 加载所有问卷结果
  const loadAllResults = useCallback(() => {
    setIsLoading(true);
    const allResults: Record<string, SurveyResult[]> = {};

    // 加载所有问卷类型的结果
    Object.keys(availableSurveys).forEach((surveyId) => {
      const resultsKey = getSurveyResultsKey(surveyId);
      try {
        const storedResults = localStorage.getItem(resultsKey);
        if (storedResults) {
          allResults[surveyId] = JSON.parse(storedResults);
        }
      } catch (error) {
        console.error(`加载问卷 ${surveyId} 结果失败:`, error);
      }
    });

    // 加载默认问卷结果
    try {
      const defaultResults = localStorage.getItem(getSurveyResultsKey('default'));
      if (defaultResults) {
        allResults['default'] = JSON.parse(defaultResults);
      }
    } catch (error) {
      console.error('加载默认问卷结果失败:', error);
    }

    setResults(allResults);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAllResults();
  }, [loadAllResults]);

  // 删除单个结果
  const deleteResult = (surveyId: string, resultId: number) => {
    if (window.confirm('确定要删除这个问卷结果吗？')) {
      const surveyResults = results[surveyId] || [];
      const updatedResults = surveyResults.filter((result) => result.id !== resultId);

      const newResults = { ...results };
      if (updatedResults.length > 0) {
        newResults[surveyId] = updatedResults;
      } else {
        delete newResults[surveyId];
      }

      setResults(newResults);

      // 更新 localStorage
      localStorage.setItem(getSurveyResultsKey(surveyId), JSON.stringify(updatedResults));
    }
  };

  // 清除特定问卷的所有结果
  const clearSurveyResults = (surveyId: string) => {
    if (window.confirm(`确定要清除"${getSurveyTitle(surveyId)}"的所有结果吗？`)) {
      const newResults = { ...results };
      delete newResults[surveyId];
      setResults(newResults);

      // 清除 localStorage
      localStorage.removeItem(getSurveyResultsKey(surveyId));
    }
  };

  // 清除所有结果
  const clearAllResults = () => {
    if (window.confirm('确定要清除所有问卷结果吗？此操作不可恢复。')) {
      // 清除所有问卷类型的 localStorage
      Object.keys(availableSurveys).forEach((surveyId) => {
        localStorage.removeItem(getSurveyResultsKey(surveyId));
      });
      localStorage.removeItem(getSurveyResultsKey('default'));

      setResults({});
    }
  };

  // 重新填写问卷（基于特定结果）
  const restartWithResult = (surveyId: string, resultData: SurveyResult) => {
    // 保存到临时存储，供问卷页面读取
    localStorage.setItem(
      'survey_restart_data',
      JSON.stringify({
        surveyId,
        data: resultData,
        timestamp: new Date().toISOString(),
      })
    );

    // 跳转到问卷页面
    window.location.href = `/survey?restart=${surveyId}`;
  };

  // 获取问卷标题
  const getSurveyTitle = (surveyId: string): string => {
    if (surveyId === 'default') return '默认问卷';
    const survey = availableSurveys[surveyId as keyof typeof availableSurveys];
    return survey?.title || surveyId;
  };

  // 格式化时间
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取所有结果（按时间倒序）- 使用 useMemo 缓存避免重复排序
  const allResultsSorted = useMemo((): SurveyResult[] => {
    const all: SurveyResult[] = [];
    Object.values(results).forEach((surveyResults) => {
      all.push(...surveyResults);
    });
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [results]);

  // 获取筛选后的结果
  const filteredResults = useMemo((): SurveyResult[] => {
    if (selectedSurvey === 'all') {
      return allResultsSorted;
    }
    return results[selectedSurvey] || [];
  }, [selectedSurvey, results, allResultsSorted]);

  // 统计数据 - 使用 useMemo 缓存
  const stats = useMemo(
    () => ({
      total: allResultsSorted.length,
      bySurvey: Object.keys(results).reduce(
        (acc, surveyId) => {
          acc[surveyId] = (results[surveyId] ?? []).length;
          return acc;
        },
        {} as Record<string, number>
      ),
    }),
    [allResultsSorted.length, results]
  );

  // 导出数据
  const handleExport = () => {
    const exportObj = {
      exportedAt: new Date().toISOString(),
      totalResults: allResultsSorted.length,
      resultsBySurvey: results,
    };

    setExportData(JSON.stringify(exportObj, null, 2));
    setShowExportModal(true);
  };

  // 下载导出数据
  const downloadExport = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">加载问卷结果中...</p>
      </div>
    );
  }

  return (
    <div className="survey-results space-y-8">
      {/* 统计信息和操作栏 */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">问卷结果</h2>
            <p className="text-gray-600">
              共保存了 <span className="font-semibold text-blue-600">{stats.total}</span> 份问卷结果
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
            >
              导出数据
            </button>
            <button
              onClick={clearAllResults}
              className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              清除所有
            </button>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-4">
            <span className="font-medium text-gray-700">筛选问卷类型：</span>
            <select
              value={selectedSurvey}
              onChange={(e) => setSelectedSurvey(e.target.value)}
              aria-label="筛选问卷类型"
              className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">所有问卷 ({stats.total})</option>
              {Object.keys(results).map((surveyId) => (
                <option key={surveyId} value={surveyId}>
                  {getSurveyTitle(surveyId)} ({(results[surveyId] ?? []).length})
                </option>
              ))}
            </select>
          </div>

          {/* 问卷类型统计 */}
          <div className="flex flex-wrap gap-3">
            {Object.keys(results).map((surveyId) => (
              <div
                key={surveyId}
                className={`rounded-full px-3 py-1 text-sm ${selectedSurvey === surveyId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
              >
                {getSurveyTitle(surveyId)}: {(results[surveyId] ?? []).length}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 结果列表 */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        {filteredResults.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="mx-auto mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-semibold text-gray-700">暂无问卷结果</h3>
            <p className="mb-6 text-gray-500">您还没有完成任何调查问卷。</p>
            <a
              href="/survey"
              className="inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              前往填写问卷
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                共 {filteredResults.length} 个结果
                {selectedSurvey !== 'all' && ` (${getSurveyTitle(selectedSurvey)})`}
              </h3>
              {selectedSurvey !== 'all' && (
                <button
                  onClick={() => clearSurveyResults(selectedSurvey)}
                  className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-200"
                >
                  清除此类问卷
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
                >
                  <div className="mb-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-medium text-gray-800">{result.surveyTitle}</span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">{result.surveyId}</span>
                      </div>
                      <div className="text-sm text-gray-500">{formatTime(result.timestamp)}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => restartWithResult(result.surveyId, result)}
                        className="rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                      >
                        重新填写（基于此结果）
                      </button>
                      <a
                        href="/survey"
                        className="inline-block rounded-md bg-green-100 px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-200"
                      >
                        重新填写（全新）
                      </a>
                      <button
                        onClick={() => deleteResult(result.surveyId, result.id)}
                        className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-200"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <details>
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        查看详细回答
                      </summary>
                      <div className="mt-2 max-h-60 overflow-auto rounded bg-gray-50 p-3">
                        <pre className="text-xs text-gray-700">{JSON.stringify(result, null, 2)}</pre>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 导出模态框 */}
      {showExportModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">导出问卷数据</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  aria-label="关闭"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">导出所有问卷结果为 JSON 格式，可用于备份或分析。</p>
            </div>

            <div className="flex-grow overflow-auto p-6">
              <div className="rounded bg-gray-800 p-4">
                <pre className="overflow-auto text-sm text-green-400">{exportData}</pre>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={downloadExport}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                下载 JSON 文件
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
