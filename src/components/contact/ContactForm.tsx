'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { submitContact } from '@/lib/api/django'

const schema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ کاراکتر باشد'),
  phone: z
    .string()
    .regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۱۲۳۴۵۶۷)'),
  message: z.string().min(10, 'پیام حداقل ۱۰ کاراکتر باشد'),
})

type FormValues = z.infer<typeof schema>

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', message: '' },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    try {
      await submitContact(values)
      form.reset()
      setSent(true)
      toast.success('پیام شما با موفقیت ارسال شد', {
        description: 'کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.',
      })
      setTimeout(() => setSent(false), 3000)
    } catch {
      toast.error('خطا در ارسال پیام. لطفاً دوباره تلاش کنید.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-text-primary font-medium">نام و نام خانوادگی</FormLabel>
              <FormControl>
                <Input
                  placeholder="محمد احمدی"
                  className="h-12 rounded-xl border-border-default/50 focus:border-navy/30 focus:ring-navy/10 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-text-primary font-medium">شماره موبایل</FormLabel>
              <FormControl>
                <Input
                  placeholder="09121234567"
                  dir="ltr"
                  className="h-12 rounded-xl border-border-default/50 focus:border-navy/30 focus:ring-navy/10 transition-all duration-200 text-left"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-text-primary font-medium">پیام</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="پیام خود را بنویسید..."
                  className="resize-none min-h-[140px] rounded-xl border-border-default/50 focus:border-navy/30 focus:ring-navy/10 transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-navy hover:bg-navy-dark hover:shadow-lg text-white h-12 rounded-xl text-base font-bold transition-all duration-200 gap-2 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال ارسال...
                </motion.span>
              ) : sent ? (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  ارسال شد!
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  ارسال پیام
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}
