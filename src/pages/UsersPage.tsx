import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  Eye,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { Brand } from '../components/Brand'
import { Dialog } from '../components/Dialog'
import { UserForm } from '../components/UserForm'
import { useAuth } from '../context/auth'
import { errorMessage, initials } from '../lib/validation'
import { userService } from '../services'
import { roles, statuses, type User } from '../types'

type Modal =
  | { type: 'create' }
  | { type: 'edit' | 'view' | 'delete'; user: User }
  | { type: 'help' }
  | null
const PAGE_SIZE = 7
const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})
const date = (value: string) => dateFormatter.format(new Date(value))

export function UsersPage() {
  const { session, logout } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All roles')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<'asc' | 'desc' | null>(null)
  const [modal, setModal] = useState<Modal>(null)
  const [busy, setBusy] = useState(false)
  const [modalError, setModalError] = useState('')
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    let cancelled = false
    userService
      .list()
      .then((data) => {
        if (!cancelled) {
          setUsers(data)
          setError('')
        }
      })
      .catch((cause) => {
        if (!cancelled) setError(errorMessage(cause))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refresh])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])
  const filtered = users.filter(
    (user) =>
      `${user.name} ${user.email}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (role === 'All roles' || user.role === role) &&
      (status === 'All statuses' || user.status === status),
  )
  if (sort)
    filtered.sort(
      (a, b) => a.name.localeCompare(b.name) * (sort === 'asc' ? 1 : -1),
    )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const hasFilters =
    query !== '' || role !== 'All roles' || status !== 'All statuses'
  function clearFilters() {
    setQuery('')
    setRole('All roles')
    setStatus('All statuses')
    setPage(1)
  }
  function openModal(value: Modal) {
    setModalError('')
    setModal(value)
  }
  function saved(user: User) {
    const edited = modal?.type === 'edit'
    setUsers((current) =>
      edited
        ? current.map((item) => (item.id === user.id ? user : item))
        : [user, ...current],
    )
    setModal(null)
    clearFilters()
    setSort(null)
    setNotice(
      edited
        ? 'User updated successfully.'
        : 'New user added to your workspace.',
    )
  }
  async function removeUser(user: User) {
    setBusy(true)
    setModalError('')
    try {
      await userService.remove(user.id)
      setUsers((current) => current.filter((item) => item.id !== user.id))
      setModal(null)
      setNotice(`${user.name} was deleted.`)
    } catch (cause) {
      setModalError(errorMessage(cause))
    } finally {
      setBusy(false)
    }
  }
  function exportUsers() {
    // Prefix spreadsheet formulas so exported user input is safe to open in Excel.
    const cell = (value: string) =>
      `"${(/^[=+\-@\t\r]/.test(value) ? "'" + value : value).replaceAll('"', '""')}"`
    const rows = [
      ['Name', 'Email', 'Role', 'Status', 'Joined'],
      ...filtered.map((user) => [
        user.name,
        user.email,
        user.role,
        user.status,
        date(user.createdAt),
      ]),
    ]
    const url = URL.createObjectURL(
      new Blob(
        ['\uFEFF' + rows.map((row) => row.map(cell).join(',')).join('\r\n')],
        { type: 'text/csv;charset=utf-8;' },
      ),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'rewards-iq-users.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice(
      `Exported ${filtered.length} ${filtered.length === 1 ? 'user' : 'users'}.`,
    )
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand light />
        <div className="workspace-switch">
          <span className="workspace-icon">
            <LayoutGrid size={17} />
          </span>
          <div>
            <strong>My workspace</strong>
            <small>Team management</small>
          </div>
        </div>
        <span className="nav-heading">Workspace</span>
        <nav aria-label="Main navigation">
          <Link className="nav-link active" to="/users" aria-current="page">
            <Users size={19} />
            <span>Users</span>
            <span className="nav-count">{users.length}</span>
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-tip">
            <span className="tip-icon">
              <SparkleIcon />
            </span>
            <h3>A team that grows together.</h3>
            <p>
              Keep your people organized, connected, and ready for what’s next.
            </p>
            <button
              onClick={() => openModal({ type: 'create' })}
              disabled={loading || !!error}
            >
              Grow your team <ArrowUpRight size={15} />
            </button>
          </div>
          <button
            className="nav-link help-link"
            onClick={() => openModal({ type: 'help' })}
          >
            <CircleHelp size={18} />
            Help & getting started
          </button>
          <div className="sidebar-profile">
            <span className="avatar avatar-admin">
              {initials(session!.name)}
            </span>
            <div>
              <strong>{session!.name}</strong>
              <small>Workspace admin</small>
            </div>
            <button
              className="icon-button"
              title="Sign out"
              aria-label="Sign out"
              onClick={() => {
                void logout().catch((cause) => setError(errorMessage(cause)))
              }}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>Users</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-label">
              <span />
              Demo workspace
            </span>
            <span className="avatar avatar-admin header-avatar">
              {initials(session!.name)}
            </span>
          </div>
        </header>
        <main className="workspace-main">
          <div className="page-heading">
            <div>
              <div className="section-kicker">Team management</div>
              <h1>
                Your team, together<span>.</span>
              </h1>
              <p>Manage your people and make good things happen.</p>
            </div>
            <button
              className="button primary"
              onClick={() => openModal({ type: 'create' })}
              disabled={loading || !!error}
            >
              <Plus size={18} />
              Add user
            </button>
          </div>
          <div className="stats-grid">
            {[
              {
                label: 'Total users',
                value: users.length,
                detail: 'People in your workspace',
                icon: Users,
                color: 'purple',
              },
              {
                label: 'Active users',
                value: users.filter((user) => user.status === 'Active').length,
                detail: 'Ready to make an impact',
                icon: UserCheck,
                color: 'green',
              },
              {
                label: 'Pending invites',
                value: users.filter((user) => user.status === 'Invited').length,
                detail: 'Marked as invited',
                icon: Mail,
                color: 'orange',
              },
              {
                label: 'Administrators',
                value: users.filter((user) => user.role === 'Admin').length,
                detail: 'Keeping things running',
                icon: ShieldCheck,
                color: 'blue',
              },
            ].map(({ label, value, detail, icon: Icon, color }) => (
              <div className="stat-card" key={label}>
                <div className="stat-top">
                  <span>{label}</span>
                  <span className={`stat-icon ${color}`}>
                    <Icon size={18} />
                  </span>
                </div>
                <strong>
                  {loading || error ? '—' : value.toString().padStart(2, '0')}
                </strong>
                <small>{detail}</small>
              </div>
            ))}
          </div>
          <section className="directory" aria-labelledby="directory-title">
            <div className="directory-heading">
              <div>
                <h2 id="directory-title">
                  User directory <span>{users.length} users</span>
                </h2>
                <p>A little organization goes a long way.</p>
              </div>
              <button
                className="button secondary"
                onClick={exportUsers}
                disabled={loading || !!error || !filtered.length}
              >
                <Download size={16} />
                Export
              </button>
            </div>
            <div className="directory-toolbar">
              <div className="search-input">
                <Search size={18} />
                <input
                  aria-label="Search users"
                  placeholder="Search by name or email…"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setPage(1)
                  }}
                />
                {query && (
                  <button
                    className="icon-button"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery('')
                      setPage(1)
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <div className="filters">
                <select
                  aria-label="Filter by role"
                  value={role}
                  onChange={(event) => {
                    setRole(event.target.value)
                    setPage(1)
                  }}
                >
                  <option>All roles</option>
                  {roles.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <select
                  aria-label="Filter by status"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value)
                    setPage(1)
                  }}
                >
                  <option>All statuses</option>
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                {hasFilters && (
                  <button className="text-button" onClick={clearFilters}>
                    Reset
                  </button>
                )}
              </div>
            </div>
            {loading ? (
              <div className="empty-state" role="status">
                <LoaderCircle className="spin" size={26} />
                <h3>Getting your team ready…</h3>
              </div>
            ) : error ? (
              <div className="empty-state">
                <p className="error-banner" role="alert">
                  {error}
                </p>
                <button
                  className="button secondary"
                  onClick={() => {
                    setLoading(true)
                    setRefresh((value) => value + 1)
                  }}
                >
                  Try again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">
                  <Users size={28} />
                </span>
                <h3>
                  {hasFilters
                    ? 'No users match your search'
                    : 'Your team starts here'}
                </h3>
                <p>
                  {hasFilters
                    ? 'Try another name, email, or filter.'
                    : 'Add your first user to get things moving.'}
                </p>
                <button
                  className="button secondary"
                  onClick={
                    hasFilters
                      ? clearFilters
                      : () => openModal({ type: 'create' })
                  }
                >
                  {hasFilters ? 'Clear filters' : 'Add your first user'}
                </button>
              </div>
            ) : (
              <>
                <p className="table-scroll-hint">
                  Swipe the table to see all details and actions.
                </p>
                <div
                  className="table-scroll"
                  role="region"
                  aria-label="User directory table"
                  tabIndex={0}
                >
                  <table>
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          aria-sort={
                            sort === 'asc'
                              ? 'ascending'
                              : sort === 'desc'
                                ? 'descending'
                                : 'none'
                          }
                        >
                          <button
                            className="sort-button"
                            onClick={() =>
                              setSort(sort === 'asc' ? 'desc' : 'asc')
                            }
                          >
                            User{' '}
                            {sort === 'desc' ? (
                              <ArrowDown size={13} />
                            ) : (
                              <ArrowUp size={13} />
                            )}
                          </button>
                        </th>
                        <th scope="col">Role</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date joined</th>
                        <th scope="col" className="actions-heading">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((user, index) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell">
                              <span className={`avatar avatar-${index % 5}`}>
                                {initials(user.name)}
                              </span>
                              <div>
                                <button
                                  className="user-name"
                                  onClick={() =>
                                    openModal({ type: 'view', user })
                                  }
                                >
                                  {user.name}
                                </button>
                                <span className="user-email">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`role-pill role-${user.role.toLowerCase()}`}
                            >
                              {user.role === 'Admin' && (
                                <ShieldCheck size={12} />
                              )}
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-pill status-${user.status.toLowerCase()}`}
                            >
                              <span />
                              {user.status}
                            </span>
                          </td>
                          <td className="date-cell">{date(user.createdAt)}</td>
                          <td>
                            <div className="row-actions">
                              <button
                                className="icon-button"
                                aria-label={`View ${user.name}`}
                                title="View user"
                                onClick={() =>
                                  openModal({ type: 'view', user })
                                }
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="icon-button"
                                aria-label={`Edit ${user.name}`}
                                title="Edit user"
                                onClick={() =>
                                  openModal({ type: 'edit', user })
                                }
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="icon-button delete-action"
                                aria-label={`Delete ${user.name}`}
                                title="Delete user"
                                onClick={() =>
                                  openModal({ type: 'delete', user })
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <span>
                    Showing{' '}
                    <strong>
                      {(currentPage - 1) * PAGE_SIZE + 1}–
                      {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                    </strong>{' '}
                    of <strong>{filtered.length}</strong> users
                  </span>
                  <div>
                    <button
                      className="button secondary page-arrow"
                      aria-label="Previous page"
                      disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="page-indicator">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="button secondary page-arrow"
                      aria-label="Next page"
                      disabled={currentPage === totalPages}
                      onClick={() => setPage(currentPage + 1)}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
          <footer className="workspace-footer">
            <span>
              <ShieldCheck size={14} /> A little more organized. A lot more
              possible.
            </span>
            <span>Made for your people.</span>
          </footer>
        </main>
      </div>
      {notice && (
        <div className="toast" role="status">
          <span>
            <Check size={16} />
          </span>
          {notice}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setNotice('')}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <UserForm
          user={modal.type === 'edit' ? modal.user : undefined}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}
      {modal?.type === 'view' && (
        <Dialog
          title="User details"
          description="A closer look at your team member."
          onClose={() => setModal(null)}
        >
          <div className="dialog-body">
            <div className="profile-preview">
              <span className="avatar avatar-0">
                {initials(modal.user.name)}
              </span>
              <h3>{modal.user.name}</h3>
              <p>{modal.user.email}</p>
            </div>
            <dl className="detail-list">
              <div>
                <dt>Role</dt>
                <dd>{modal.user.role}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span
                    className={`status-pill status-${modal.user.status.toLowerCase()}`}
                  >
                    <span />
                    {modal.user.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Date joined</dt>
                <dd>{date(modal.user.createdAt)}</dd>
              </div>
            </dl>
          </div>
          <div className="dialog-footer">
            <button className="button secondary" onClick={() => setModal(null)}>
              Close
            </button>
            <button
              className="button primary"
              onClick={() => openModal({ type: 'edit', user: modal.user })}
            >
              <Pencil size={15} />
              Edit user
            </button>
          </div>
        </Dialog>
      )}
      {modal?.type === 'delete' && (
        <Dialog
          title="Delete this user?"
          description="This will permanently remove their profile from this workspace."
          onClose={() => setModal(null)}
          busy={busy}
          compact
        >
          <div className="dialog-body">
            <div className="delete-preview">
              <span className="avatar avatar-0">
                {initials(modal.user.name)}
              </span>
              <div>
                <strong>{modal.user.name}</strong>
                <p>{modal.user.email}</p>
              </div>
            </div>
            {modalError && (
              <p className="error-banner" role="alert">
                {modalError}
              </p>
            )}
          </div>
          <div className="dialog-footer">
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => setModal(null)}
            >
              Cancel
            </button>
            <button
              className="button danger"
              disabled={busy}
              onClick={() => {
                void removeUser(modal.user)
              }}
            >
              {busy ? (
                <LoaderCircle className="spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
              Delete user
            </button>
          </div>
        </Dialog>
      )}
      {modal?.type === 'help' && (
        <Dialog
          title="Make yourself at home"
          description="Everything you need to explore your workspace."
          onClose={() => setModal(null)}
        >
          <div className="dialog-body help-content">
            <p>
              <strong>Add your people.</strong> Use Add user to create a profile
              with a name, email, role, and status.
            </p>
            <p>
              <strong>Find and manage.</strong> Search, filter, or sort the
              directory. View a profile, edit its details, or delete it using
              the row actions.
            </p>
            <p>
              <strong>Take your data with you.</strong> Export downloads the
              users matching your current filters as a CSV file.
            </p>
            <p className="form-note">
              This is a local demo. Login is simulated, roles do not enforce
              permissions, and invites are not sent. Data is saved only in this
              browser.
            </p>
          </div>
          <div className="dialog-footer">
            <button className="button primary" onClick={() => setModal(null)}>
              Got it
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
function SparkleIcon() {
  return <UserPlus size={20} />
}
