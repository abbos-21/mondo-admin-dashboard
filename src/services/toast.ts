import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

const showToast = (
  description: string,
  variant: 'default' | 'destructive' = 'default',
  duration: number = 1000,
) => {
  toast({
    description,
    variant,
    duration,
  })
}

export default showToast
