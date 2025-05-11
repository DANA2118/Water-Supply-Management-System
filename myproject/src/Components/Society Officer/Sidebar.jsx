import React from 'react'
import './Sidebar.css'
import { BiHome, BiCollection, BiReceipt, BiCalendar, BiAbacus, BiChart } from 'react-icons/bi'
import { FaTint } from 'react-icons/fa'

const navItems = [
  { icon: <BiHome />,    label: 'Dashboard',             href: '/HomeContent' },
  { icon: <BiCollection />, label: 'Connections',         href: '/Connection' },
  { icon: <BiReceipt />, label: 'Invoices',         href: '/invoice'       },
  { icon: <BiAbacus />,  label: 'Payment Voucher',               href: '/cost'    },
  { icon: <BiChart />,      label: 'Reports',               href: '/reports' },
  { icon: <BiCalendar />, label: 'Certificate Scheduling', href: '/certificate' },
]

export default function Sidebar() {
  const current = window.location.pathname
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <FaTint className="logo-icon" />
        <span className="logo-text">HydroNet</span>
      </div>
      <ul className="sidebar-nav">
        {navItems.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              className={current === it.href ? 'active' : ''}
            >
              <span className="icon">{it.icon}</span>
              <span className="text">{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
