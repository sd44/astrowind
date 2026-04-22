// SurveyJS 问卷 JSON 配置
// 这里定义了示例调查问卷的结构

export const customerSatisfactionSurvey = {
  title: '客户满意度调查',
  description: '请花几分钟时间填写此调查问卷，帮助我们改进服务。',
  logoPosition: 'right',
  pages: [
    {
      name: 'page1',
      elements: [
        {
          type: 'rating',
          name: 'overallSatisfaction',
          title: '您对我们的服务整体满意度如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5,
          minRateDescription: '非常不满意',
          maxRateDescription: '非常满意'
        },
        {
          type: 'rating',
          name: 'productQuality',
          title: '您对我们的产品质量评价如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5,
          minRateDescription: '很差',
          maxRateDescription: '很好'
        },
        {
          type: 'rating',
          name: 'customerService',
          title: '您对我们的客户服务评价如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5,
          minRateDescription: '很差',
          maxRateDescription: '很好'
        }
      ]
    },
    {
      name: 'page2',
      elements: [
        {
          type: 'radiogroup',
          name: 'recommend',
          title: '您会向朋友或同事推荐我们的服务吗？',
          isRequired: true,
          choices: [
            { value: 'definitely', text: '一定会' },
            { value: 'probably', text: '可能会' },
            { value: 'unsure', text: '不确定' },
            { value: 'probablyNot', text: '可能不会' },
            { value: 'definitelyNot', text: '一定不会' }
          ]
        },
        {
          type: 'comment',
          name: 'suggestions',
          title: '您有什么建议或意见可以帮助我们改进？',
          rows: 4
        }
      ]
    },
    {
      name: 'page3',
      elements: [
        {
          type: 'text',
          name: 'name',
          title: '您的姓名（可选）',
          placeholder: '请输入您的姓名'
        },
        {
          type: 'text',
          name: 'email',
          title: '您的邮箱地址（可选，用于接收调查结果）',
          inputType: 'email',
          placeholder: 'example@email.com',
          validators: [
            {
              type: 'email'
            }
          ]
        },
        {
          type: 'boolean',
          name: 'contactPermission',
          title: '是否允许我们通过邮箱与您联系？',
          labelTrue: '是',
          labelFalse: '否',
          defaultValue: false
        }
      ]
    }
  ],
  showProgressBar: 'bottom',
  progressBarType: 'questions',
  firstPageIsStarted: false,
  startSurveyText: '开始调查',
  pagePrevText: '上一页',
  pageNextText: '下一页',
  completeText: '提交',
  completedHtml: '<h3 class="text-2xl font-bold text-green-600 mb-4">感谢您参与调查！</h3><p class="text-gray-700">您的反馈对我们非常重要，将帮助我们提供更好的服务。</p>'
};

export const productFeedbackSurvey = {
  title: '产品反馈调查',
  description: '请帮助我们改进产品体验',
  pages: [
    {
      name: 'productFeedback',
      elements: [
        {
          type: 'rating',
          name: 'easeOfUse',
          title: '产品易用性如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5,
          minRateDescription: '非常难用',
          maxRateDescription: '非常易用'
        },
        {
          type: 'rating',
          name: 'design',
          title: '产品设计美观度如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5,
          minRateDescription: '不美观',
          maxRateDescription: '非常美观'
        },
        {
          type: 'rating',
          name: 'performance',
          title: '产品性能表现如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5,
          minRateDescription: '很差',
          maxRateDescription: '很好'
        },
        {
          type: 'comment',
          name: 'improvements',
          title: '您希望产品增加哪些功能或改进？',
          rows: 4
        },
        {
          type: 'checkbox',
          name: 'features',
          title: '您最喜欢产品的哪些功能？（可多选）',
          choices: [
            { value: 'ui', text: '用户界面' },
            { value: 'speed', text: '响应速度' },
            { value: 'features', text: '功能丰富' },
            { value: 'stability', text: '稳定性' },
            { value: 'support', text: '技术支持' },
            { value: 'price', text: '价格合理' }
          ]
        }
      ]
    }
  ],
  completedHtml: '<h3 class="text-2xl font-bold text-green-600 mb-4">感谢您的宝贵反馈！</h3><p class="text-gray-700">您的意见将帮助我们打造更好的产品。</p>'
};

export const employeeFeedbackSurvey = {
  title: '员工满意度调查',
  description: '匿名调查，请如实填写以帮助我们改善工作环境',
  pages: [
    {
      name: 'workEnvironment',
      elements: [
        {
          type: 'rating',
          name: 'workSatisfaction',
          title: '您对当前工作的满意度如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5
        },
        {
          type: 'rating',
          name: 'teamCollaboration',
          title: '团队协作氛围如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5
        },
        {
          type: 'rating',
          name: 'managementSupport',
          title: '管理层支持度如何？',
          isRequired: true,
          rateMin: 1,
          rateMax: 5
        },
        {
          type: 'comment',
          name: 'suggestions',
          title: '您对公司有什么建议？',
          rows: 4
        }
      ]
    }
  ],
  completedHtml: '<h3 class="text-2xl font-bold text-blue-600 mb-4">感谢您的反馈！</h3><p class="text-gray-700">您的意见将帮助我们创造更好的工作环境。</p>'
};

// 默认使用的调查问卷
export const defaultSurvey = customerSatisfactionSurvey;

// 所有可用的调查问卷
export const availableSurveys = {
  customerSatisfaction: customerSatisfactionSurvey,
  productFeedback: productFeedbackSurvey,
  employeeFeedback: employeeFeedbackSurvey
};

// 获取调查问卷的本地存储键名
export const getSurveyStorageKey = (surveyId: string = 'default') => {
  return `surveyjs_${surveyId}_data`;
};

// 获取调查问卷结果的本地存储键名
export const getSurveyResultsKey = (surveyId: string = 'default') => {
  return `surveyjs_${surveyId}_results`;
};