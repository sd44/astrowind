import React, { useState } from 'react';
import { Model } from 'survey-core';
import SurveyComponent from './SurveyComponent';
import { availableSurveys, defaultSurvey } from '../../data/survey-json';

export default function SurveyExample() {
  const [selectedSurvey, setSelectedSurvey] = useState<string>('customerSatisfaction');

  const handleSurveyComplete = (_sender: Model, results: Record<string, unknown>) => {
    console.log('Survey completed:', results);
  };

  const getCurrentSurveyJson = () => {
    return availableSurveys[selectedSurvey as keyof typeof availableSurveys] || defaultSurvey;
  };

  const handleSurveyChange = (surveyKey: string) => {
    setSelectedSurvey(surveyKey);
  };

  return (
    <div className="survey-example space-y-8">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">SurveyJS 调查问卷示例</h2>
        <p className="mb-6 text-gray-600">
          这是一个使用 SurveyJS 库创建的调查问卷示例。SurveyJS 是一个功能强大的 JavaScript
          调查库，支持创建各种类型的调查问卷。
        </p>

        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">选择调查问卷类型：</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSurveyChange('customerSatisfaction')}
              className={`rounded-md px-4 py-2 ${selectedSurvey === 'customerSatisfaction' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              客户满意度调查
            </button>
            <button
              onClick={() => handleSurveyChange('productFeedback')}
              className={`rounded-md px-4 py-2 ${selectedSurvey === 'productFeedback' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              产品反馈调查
            </button>
            <button
              onClick={() => handleSurveyChange('employeeFeedback')}
              className={`rounded-md px-4 py-2 ${selectedSurvey === 'employeeFeedback' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              员工满意度调查
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedSurvey === 'customerSatisfaction' && '客户满意度调查'}
            {selectedSurvey === 'productFeedback' && '产品反馈调查'}
            {selectedSurvey === 'employeeFeedback' && '员工满意度调查'}
          </h3>
          <div className="text-sm text-gray-500">
            当前问卷ID: <code className="rounded bg-gray-100 px-2 py-1">{selectedSurvey}</code>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 font-medium text-blue-800">📋 功能说明：</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• 填写进度自动保存到浏览器 localStorage</li>
            <li>• 关闭页面后可继续填写</li>
            <li>• 问卷完成后可查看本次结果</li>
            <li>• 支持"再填一份"操作（全新或读取上一份）</li>
            <li>• 所有结果自动保存，可查看历史记录</li>
          </ul>
        </div>

        <SurveyComponent json={getCurrentSurveyJson()} surveyId={selectedSurvey} onComplete={handleSurveyComplete} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">数据存储说明</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="mb-2 font-medium text-green-800">✅ 自动保存功能</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• 每道题目的答案都会自动保存</li>
              <li>• 切换页面时自动保存进度</li>
              <li>• 使用浏览器 localStorage 存储</li>
              <li>• 数据仅保存在您的本地浏览器中</li>
            </ul>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-2 font-medium text-purple-800">📊 结果管理</h4>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• 每份完成的问卷结果都会保存</li>
              <li>• 最多保存最近 50 份结果</li>
              <li>• 每份结果包含时间戳和唯一ID</li>
              <li>• 支持查看所有历史结果</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h4 className="mb-2 text-lg font-semibold text-blue-800">SurveyJS 功能特性</h4>
        <ul className="list-disc space-y-1 pl-5 text-blue-700">
          <li>支持 20+ 种问题类型（单选、多选、评分、文本等）</li>
          <li>响应式设计，适配移动设备</li>
          <li>多语言支持</li>
          <li>逻辑跳转和条件显示</li>
          <li>主题定制和样式自定义</li>
          <li>数据验证和实时预览</li>
          <li>支持导出为 JSON、PDF 等格式</li>
        </ul>
      </div>
    </div>
  );
}
