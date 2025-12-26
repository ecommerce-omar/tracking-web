import api from '@/services/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { EmailTemplateFormData, UpdateEmailTemplateFormData } from '@/schemas/email-templates-schema'

interface EmailTemplate extends EmailTemplateFormData {
  id: string
  created_at: string
  updated_at: string
  category?: string
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['email_templates'],
    queryFn: async (): Promise<EmailTemplate[]> => {
      console.log('Fetching email templates...')
      const response = await api.get<EmailTemplate[]>('/email_templates', {
        params: {
          'order': 'created_at.desc'  // This 'order' refers to SQL ORDER BY, not our renamed entity
        }
      })
      
      console.log('API response:', response.data)
      return response.data || []
    },
  })
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (template: UpdateEmailTemplateFormData & { id: string }): Promise<EmailTemplate> => {
      const response = await api.patch<EmailTemplate[]>('/email_templates', {
        subject: template.subject,
        body_html: template.body_html,
        is_active: template.is_active,
        category: template.category,
        updated_at: new Date().toISOString()
      }, {
        params: {
          'id': `eq.${template.id}`
        },
        headers: {
          'Prefer': 'return=representation'
        }
      })
      
      return response.data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email_templates'] })
    },
  })
}

export type { EmailTemplate }