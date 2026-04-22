import React, { useState, useEffect } from 'react';
import { availableSurveys, getSurveyResultsKey } from '../../data/survey-json';

interface SurveyResult {
  id: number;
  timestamp: string;
  surveyId: string;
  surveyTitle: string;
  [key: string]: any;
}

export default function SurveyResults() {
  const [results, setResults] = useState<Record<string, SurveyResult[]>>({});
  const [selectedSurvey, setSelectedSurvey] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<string>('');

  // 加载所有问卷结果
  useEffect(() => {
    loadAllResults();
  }, []);

  const loadAllResults = () => {
    setIsLoading(true);
    const allResults: Record<string, SurveyResult[]> = {};
    
    // 加载所有问卷类型的结果
    Object.keys(availableSurveys).forEach(surveyId => {
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
  };

  // 删除单个结果
  const deleteResult = (surveyId: string, resultId: number) => {
    if (window.confirm('确定要删除这个问卷结果吗？')) {
      const surveyResults = results[surveyId] || [];
      const updatedResults = surveyResults.filter(result => result.id !== resultId);
      
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
      Object.keys(availableSurveys).forEach(surveyId => {
        localStorage.removeItem(getSurveyResultsKey(surveyId));
      });
      localStorage.removeItem(getSurveyResultsKey('default'));
      
      setResults({});
    }
  };

  // 重新填写问卷（基于特定结果）
  const restartWithResult = (surveyId: string, resultData: any) => {
    // 保存到临时存储，供问卷页面读取
    localStorage.setItem('survey_restart_data', JSON.stringify({
      surveyId,
      data: resultData,
      timestamp: new Date().toISOString()
    }));
    
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
      minute: '2-digit'
    });
  };

  // 获取所有结果（按时间倒序）
  const getAllResults = (): SurveyResult[] => {
    const all: SurveyResult[] = [];
    Object.values(results).forEach(surveyResults => {
      all.push(...surveyResults);
    });
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // 获取筛选后的结果
  const getFilteredResults = (): SurveyResult[] => {
    if (selectedSurvey === 'all') {
      return getAllResults();
    }
    return results[selectedSurvey] || [];
  };

  // 导出数据
  const handleExport = () => {
    const exportObj = {
      exportedAt: new Date().toISOString(),
      totalResults: getAllResults().length,
      resultsBySurvey: results
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

  // 统计数据
  const stats = {
    total: getAllResults().length,
    bySurvey: Object.keys(results).reduce((acc, surveyId) => {
      acc[surveyId] = results[surveyId].length;
      return acc;
    }, {} as Record<string, number>)
  };

  const filteredResults = getFilteredResults();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">加载问卷结果中...</p>
      </div>
    );
  }

  return (
    <div className="survey-results space-y-8">
      {/* 统计信息和操作栏 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">问卷结果</h2>
            <p className="text-gray-600">
              共保存了 <span className="font-semibold text-blue-600">{stats.total}</span> 份问卷结果
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              导出数据
            </button>
            <button
              onClick={clearAllResults}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              清除所有
            </button>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-gray-700 font-medium">筛选问卷类型：</span>
            <select
              value={selectedSurvey}
              onChange={(e) => setSelectedSurvey(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有问卷 ({stats.total})</option>
              {Object.keys(results).map(surveyId => (
                <option key={surveyId} value={surveyId}>
                  {getSurveyTitle(surveyId)} ({results[surveyId].length})
                </option>
              ))}
            </select>
          </div>
          
          {/* 问卷类型统计 */}
          <div className="flex flex-wrap gap-3">
            {Object.keys(results).map(surveyId => (
              <div 
                key={surveyId}
                className={`px-3 py-1 rounded-full text-sm ${selectedSurvey === surveyId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
              >
                {getSurveyTitle(surveyId)}: {results[surveyId].length}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 结果列表 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无问卷结果</h3>
            <p className="text-gray-500 mb-6">您还没有完成任何调查问卷。</p>
            <a 
              href="/survey" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium inline-block"
            >
              前往填写问卷
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                共 {filteredResults.length} 个结果
                {selectedSurvey !== 'all' && ` (${getSurveyTitle(selectedSurvey)})`}
              </h3>
              {selectedSurvey !== 'all' && (
                <button
                  onClick={() => clearSurveyResults(selectedSurvey)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                >
                  清除此类问卷
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{result.surveyTitle}</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {result.surveyId}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(result.timestamp)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => restartWithResult(result.surveyId, result)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                      >
                        重新填写（基于此结果）
                      </button>
                      <a
                        href="/survey"
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm inline-block"
                      >
                        重新填写（全新）
                      </a>
                      <button
                        onClick={() => deleteResult(result.surveyId, result.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <details>
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        查看详细回答
                      </summary>
                      <div className="mt-2 bg-gray-50 rounded p-3 max-h-60 overflow-auto">
                        <pre className="text-xs text-gray-700">
                          {JSON.stringify(result, null, 2)}
                        </pre>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">导出问卷数据</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                导出所有问卷结果为 JSON 格式，可用于备份或分析。
              </p>
            </div>
            
            <div className="p-6 flex-grow overflow-auto">
              <div className="bg-gray-800 rounded p-4">
                <pre className="text-green-400 text-sm overflow-auto">
                  {exportData}
                </pre>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={downloadExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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