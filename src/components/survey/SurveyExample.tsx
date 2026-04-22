import React, { useState } from 'react';
import SurveyComponent from './SurveyComponent';
import { availableSurveys, defaultSurvey } from '../../data/survey-json';

export default function SurveyExample() {
  const [selectedSurvey, setSelectedSurvey] = useState<string>('customerSatisfaction');

  const handleSurveyComplete = (_sender: any, results: any) => {
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">SurveyJS 调查问卷示例</h2>
        <p className="text-gray-600 mb-6">
          这是一个使用 SurveyJS 库创建的调查问卷示例。SurveyJS 是一个功能强大的 JavaScript 调查库，支持创建各种类型的调查问卷。
        </p>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">选择调查问卷类型：</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSurveyChange('customerSatisfaction')}
              className={`px-4 py-2 rounded-md ${selectedSurvey === 'customerSatisfaction' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              客户满意度调查
            </button>
            <button
              onClick={() => handleSurveyChange('productFeedback')}
              className={`px-4 py-2 rounded-md ${selectedSurvey === 'productFeedback' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              产品反馈调查
            </button>
            <button
              onClick={() => handleSurveyChange('employeeFeedback')}
              className={`px-4 py-2 rounded-md ${selectedSurvey === 'employeeFeedback' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              员工满意度调查
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedSurvey === 'customerSatisfaction' && '客户满意度调查'}
            {selectedSurvey === 'productFeedback' && '产品反馈调查'}
            {selectedSurvey === 'employeeFeedback' && '员工满意度调查'}
          </h3>
          <div className="text-sm text-gray-500">
            当前问卷ID: <code className="bg-gray-100 px-2 py-1 rounded">{selectedSurvey}</code>
          </div>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">📋 功能说明：</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• 填写进度自动保存到浏览器 localStorage</li>
            <li>• 关闭页面后可继续填写</li>
            <li>• 问卷完成后可查看本次结果</li>
            <li>• 支持"再填一份"操作（全新或读取上一份）</li>
            <li>• 所有结果自动保存，可查看历史记录</li>
          </ul>
        </div>
        
        <SurveyComponent 
          json={getCurrentSurveyJson()}
          surveyId={selectedSurvey}
          onComplete={handleSurveyComplete}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">数据存储说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">✅ 自动保存功能</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• 每道题目的答案都会自动保存</li>
              <li>• 切换页面时自动保存进度</li>
              <li>• 使用浏览器 localStorage 存储</li>
              <li>• 数据仅保存在您的本地浏览器中</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">📊 结果管理</h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• 每份完成的问卷结果都会保存</li>
              <li>• 最多保存最近 50 份结果</li>
              <li>• 每份结果包含时间戳和唯一ID</li>
              <li>• 支持查看所有历史结果</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-800 mb-2">SurveyJS 功能特性</h4>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
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