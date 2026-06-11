import { supabase } from './supabase'
import type { Task, TaskType } from './types'

const APPROVAL_TYPES: TaskType[] = ['approve_mao', 'approve_offer']

export function sortTasks(tasks: Task[]): Task[] {
  const statusRank = (s: Task['status']) => (s === 'open' ? 0 : 1)
  return [...tasks].sort((a, b) => {
    if (statusRank(a.status) !== statusRank(b.status)) return statusRank(a.status) - statusRank(b.status)
    const aApp = APPROVAL_TYPES.includes(a.type) ? 0 : 1
    const bApp = APPROVAL_TYPES.includes(b.type) ? 0 : 1
    if (aApp !== bApp) return aApp - bApp
    return a.created_at.localeCompare(b.created_at)
  })
}

export async function listTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*')
  if (error) throw error
  return sortTasks((data ?? []) as Task[])
}

let warnedUnavailable = false

/**
 * Graceful task-queue fetch: when the `tasks` table is not provisioned in the
 * environment (e.g. 0001_poc_tasks_and_gates.sql not yet applied remotely),
 * returns `unavailable: true` instead of throwing — and warns once.
 */
export async function listTasksSafe(): Promise<{ tasks: Task[]; unavailable: boolean }> {
  try {
    const { data, error } = await supabase.from('tasks').select('*')
    if (error) {
      if (!warnedUnavailable) {
        console.warn('Task queue unavailable (tasks table not provisioned yet):', error.message)
        warnedUnavailable = true
      }
      return { tasks: [], unavailable: true }
    }
    return { tasks: sortTasks((data ?? []) as Task[]), unavailable: false }
  } catch (err) {
    if (!warnedUnavailable) {
      console.warn('Task queue unavailable:', err)
      warnedUnavailable = true
    }
    return { tasks: [], unavailable: true }
  }
}

export async function createTask(input: {
  type: TaskType; title: string; detail?: string
  lead_id?: string | null; deal_id?: string | null; due_date?: string | null
}): Promise<void> {
  const { error } = await supabase.from('tasks').insert({
    type: input.type, title: input.title, detail: input.detail ?? null,
    lead_id: input.lead_id ?? null, deal_id: input.deal_id ?? null, due_date: input.due_date ?? null,
  })
  if (error) throw error
}

export async function setTaskStatus(id: string, status: Task['status']): Promise<void> {
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) throw error
}
