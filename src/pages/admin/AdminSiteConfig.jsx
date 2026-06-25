'use client'
import React, { useEffect, useState } from 'react'

const API = '/api/admin/site-config'

function Section({ title, children, onSave, saving }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white">{title}</h2>
        <button onClick={onSave} disabled={saving}
          className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-60">
          {saving ? 'در حال ذخیره...' : 'ذخیره'}
        </button>
      </div>
      {children}
    </div>
  )
}

export default function AdminSiteConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#4F46E5')
  const [accentColor, setAccentColor] = useState('#F97316')
  const [savingColors, setSavingColors] = useState(false)
  const [stats, setStats] = useState({ users: '', uptime: '', customers: '', years: '' })
  const [savingStats, setSavingStats] = useState(false)
  const [softwareLinks, setSoftwareLinks] = useState({ portal: '', google_play: '', app_store: '' })
  const [savingLinks, setSavingLinks] = useState(false)
  const [softwareInfo, setSoftwareInfo] = useState({ description: '', features: '' })
  const [savingSoftware, setSavingSoftware] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(API)
      const r = await res.json()
      setConfig(r)
      if (r) {
        setPrimaryColor(r.primary_color || '#4F46E5')
        setAccentColor(r.accent_color || '#F97316')
        setStats({ users: r.stat_users||'', uptime: r.stat_uptime||'', customers: r.stat_customers||'', years: r.stat_years||'' })
        setSoftwareLinks({ portal: r.link_portal||'', google_play: r.link_google_play||'', app_store: r.link_app_store||'' })
        setSoftwareInfo({ description: r.software_description||'', features: Array.isArray(r.software_features) ? r.software_features.join('\n') : (r.software_features||'') })
      }
    } catch (e) { setError('خطا در بارگذاری تنظیمات') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save(data) {
    const res = await fetch(API, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) throw new Error(await res.text())
  }

  async function saveColors() { setSavingColors(true); try { await save({ primary_color: primaryColor, accent_color: accentColor }) } catch(e){setError(e.message)} setSavingColors(false) }
  async function saveStats() { setSavingStats(true); try { await save({ stat_users:stats.users, stat_uptime:stats.uptime, stat_customers:stats.customers, stat_years:stats.years }) } catch(e){setError(e.message)} setSavingStats(false) }
  async function saveLinks() { setSavingLinks(true); try { await save({ link_portal:softwareLinks.portal, link_google_play:softwareLinks.google_play, link_app_store:softwareLinks.app_store }) } catch(e){setError(e.message)} setSavingLinks(false) }
  async function saveSoftware() {
    setSavingSoftware(true)
    try {
      await save({ software_description: softwareInfo.description, software_features: softwareInfo.features.split('\n').map(l=>l.trim()).filter(Boolean) })
    } catch(e){setError(e.message)}
    setSavingSoftware(false)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">تنظیمات سایت</h1>
      {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}
      <Section title="رنگ‌بندی برند" onSave={saveColors} saving={savingColors}>
        <div className="grid grid-cols-2 gap-4">
          {[{label:'رنگ اصلی',value:primaryColor,onChange:setPrimaryColor},{label:'رنگ تأکید',value:accentColor,onChange:setAccentColor}].map(f=>(
            <div key={f.label}>
              <label className="block text-sm text-gray-400 mb-2">{f.label}</label>
              <div className="flex items-center gap-3">
                <input type="color" value={f.value} onChange={e=>f.onChange(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-700 bg-transparent cursor-pointer"/>
                <input type="text" value={f.value} onChange={e=>f.onChange(e.target.value)} className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" dir="ltr"/>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="آمار شرکت" onSave={saveStats} saving={savingStats}>
        <div className="grid grid-cols-2 gap-4">
          {[{key:'users',label:'کاربر فعال'},{key:'uptime',label:'آپتایم (%)'},{key:'customers',label:'مشتری'},{key:'years',label:'سال فعالیت'}].map(f=>(
            <div key={f.key}>
              <label className="block text-sm text-gray-400 mb-1.5">{f.label}</label>
              <input type="text" value={stats[f.key]} onChange={e=>setStats(p=>({...p,[f.key]:e.target.value}))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" dir="ltr"/>
            </div>
          ))}
        </div>
      </Section>
      <Section title="لینک‌های نرم‌افزار" onSave={saveLinks} saving={savingLinks}>
        <div className="space-y-3">
          {[{key:'portal',label:'ورود به سامانه'},{key:'google_play',label:'Google Play'},{key:'app_store',label:'App Store'}].map(f=>(
            <div key={f.key}>
              <label className="block text-sm text-gray-400 mb-1.5">{f.label}</label>
              <input type="url" value={softwareLinks[f.key]} onChange={e=>setSoftwareLinks(p=>({...p,[f.key]:e.target.value}))} placeholder="https://"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" dir="ltr"/>
            </div>
          ))}
        </div>
      </Section>
      <Section title="توضیحات نرم‌افزار" onSave={saveSoftware} saving={savingSoftware}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">متن توضیحات</label>
            <textarea value={softwareInfo.description} onChange={e=>setSoftwareInfo(p=>({...p,description:e.target.value}))} rows={4}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"/>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">ویژگی‌ها (هر خط یک ویژگی)</label>
            <textarea value={softwareInfo.features} onChange={e=>setSoftwareInfo(p=>({...p,features:e.target.value}))} rows={6}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"/>
          </div>
        </div>
      </Section>
    </div>
  )
}
