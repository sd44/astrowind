import React, { useState, useEffect, useCallback } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
import { SharpLight } from 'survey-core/themes';
import { defaultSurvey, getSurveyStorageKey, getSurveyResultsKey } from '../../data/survey-json';

interface SurveyComponentProps {
  json?: Record<string, unknown>;
  surveyId?: string;
  onComplete?: (sender: Model, results: Record<string, unknown>) => void;
  initialData?: Record<string, unknown> | null; // 初始数据，用于重新填写时预填充
}

export default function SurveyComponent({
  json = defaultSurvey,
  surveyId = 'default',
  onComplete,
  initialData = null,
}: SurveyComponentProps) {
  const [surveyModel, setSurveyModel] = useState<Model | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const storageKey = getSurveyStorageKey(surveyId);
  const resultsKey = getSurveyResultsKey(surveyId);

  // 保存当前问卷数据到 localStorage
  const saveSurveyData = useCallback(
    (data: Record<string, unknown>) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
          console.error('保存问卷数据失败:', error);
        }
      }
    },
    [storageKey]
  );

  // 从 localStorage 加载问卷数据
  const loadSurveyData = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(storageKey);
        return savedData ? JSON.parse(savedData) : null;
      } catch (error) {
        console.error('加载问卷数据失败:', error);
        return null;
      }
    }
    return null;
  }, [storageKey]);

  // 保存问卷结果到 localStorage
  const saveSurveyResults = useCallback(
    (results: Record<string, unknown>) => {
      if (typeof window !== 'undefined') {
        try {
          // 获取现有的结果数组
          const existingResults = localStorage.getItem(resultsKey);
          const resultsArray = existingResults ? JSON.parse(existingResults) : [];

          // 添加新结果（带时间戳）
          resultsArray.push({
            ...results,
            timestamp: new Date().toISOString(),
            id: Date.now(),
            surveyId: surveyId,
            surveyTitle: json.title || '未命名问卷',
          });

          // 保存回 localStorage（限制最多保存 50 个结果）
          const limitedResults = resultsArray.slice(-50);
          localStorage.setItem(resultsKey, JSON.stringify(limitedResults));
        } catch (error) {
          console.error('保存问卷结果失败:', error);
        }
      }
    },
    [resultsKey, surveyId, json.title]
  );

  // 初始化调查问卷
  useEffect(() => {
    const model = new Model(json);
    model.applyTheme(SharpLight);

    // 设置自定义样式
    model.css = {
      container: 'survey-container',
      header: 'survey-header',
      body: 'survey-body',
      footer: 'survey-footer',
      navigationButton: 'btn',
      completeButton: 'btn-primary',
    };

    // 设置初始数据（优先级：initialData > 本地保存的数据）
    const initialSurveyData = initialData ?? loadSurveyData();

    if (initialSurveyData) {
      model.data = initialSurveyData;
    }

    // 监听值变化，自动保存
    model.onValueChanged.add((sender: Model) => {
      saveSurveyData(sender.data as Record<string, unknown>);
    });

    // 监听页面变化，也保存数据
    model.onCurrentPageChanged.add((sender: Model) => {
      saveSurveyData(sender.data as Record<string, unknown>);
    });

    // 监听完成事件
    model.onComplete.add((sender: Model) => {
      const results = sender.data;
      setIsCompleted(true);
      saveSurveyResults(results);

      // 清除当前问卷的进度数据（保留结果）
      localStorage.removeItem(storageKey);

      if (onComplete) {
        onComplete(sender, results);
      }
    });

    setSurveyModel(model);

    // 清理函数
    return () => {
      if (model) {
        model.onValueChanged.clear();
        model.onCurrentPageChanged.clear();
        model.onComplete.clear();
      }
    };
  }, [json, surveyId, onComplete, saveSurveyData, loadSurveyData, saveSurveyResults, storageKey, initialData]);

  if (!surveyModel) {
    return <div className="py-8 text-center">加载调查问卷中...</div>;
  }

  return (
    <div className="survey-wrapper">
      <Survey model={surveyModel} />

      {isCompleted && (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="mb-4 flex items-center">
            <svg className="mr-2 h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-semibold text-green-800">问卷已完成！</h3>
          </div>
          <p className="mb-4 text-green-700">感谢您的参与。问卷结果已自动保存。</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/survey-manage"
              className="rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
            >
              查看和管理结果
            </a>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              再填一份
            </button>
          </div>
        </div>
      )}

      {!isCompleted && (
        <div className="mt-4 text-sm text-gray-500">
          <p>💡 提示：您的填写进度会自动保存，关闭页面后可以继续填写。</p>
          <p className="mt-1">
            完成后可以到{' '}
            <a href="/survey-manage" className="text-blue-600 hover:underline">
              问卷管理页面
            </a>{' '}
            查看结果。
          </p>
        </div>
      )}
    </div>
  );
}
