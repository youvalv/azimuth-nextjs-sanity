export default {
  title: 'Site Configuration',
  name: 'site_config',
  type: 'document',
  preview: { select: { title: 'title' } },
  fields: [
    {
      type: 'string',
      title: 'Title',
      name: 'title',
      description: 'Site title',
      validation: Rule => Rule.required()
    },
    {
      type: 'string',
      title: 'Color Palette',
      name: 'palette',
      description: 'The color palette of the site',
      validation: Rule => Rule.required(),
      options: {
        list: ['blue', 'purple', 'green', 'orange']
      }
    },
    {
      type: 'header',
      title: 'Header Configuration',
      name: 'header'
    },
    {
      type: 'footer',
      title: 'Footer Configuration',
      name: 'footer'
    },
    {
        type: 'object',
        title: 'Custom Object',
        name: 'custom_object',
        fields: [
            {
                type: 'text',
                title: 'Question',
                name: 'question'
            },
            {
                type: 'markdown',
                title: 'Answer',
                name: 'answer'
            }
        ]
    },
      {
          type: 'array',
          title: 'Partner companies',
          name: 'partner_companies',
          of: [{
              type: 'object',
              name: 'company_model',
              fields: [
                  {
                      type: 'text',
                      title: 'Company name',
                      name: 'company_name'
                  },
                  {
                      type: 'markdown',
                      title: 'Company description',
                      name: 'company_description'
                  }
              ]
          }]
      }
  ]
}
