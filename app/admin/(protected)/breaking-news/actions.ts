'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/lib/dal'
import {
  createBreakingNewsRow,
  deleteBreakingNewsRow,
  toggleBreakingNewsActiveRow,
} from '@/lib/api/adminService'

export async function addBreakingNewsAction(formData: FormData): Promise<void> {
  await requireAdmin()

  const text = String(formData.get('text') ?? '').trim()
  if (!text) return

  const sortOrder = Number(formData.get('sort_order') ?? 0) || 0

  await createBreakingNewsRow(text, sortOrder)

  revalidatePath('/')
  revalidatePath('/admin/breaking-news')
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  const isActive = formData.get('is_active') === 'true'
  if (!id) return

  await toggleBreakingNewsActiveRow(id, !isActive)

  revalidatePath('/')
  revalidatePath('/admin/breaking-news')
}

export async function deleteBreakingNewsAction(formData: FormData): Promise<void> {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  if (!id) return

  await deleteBreakingNewsRow(id)

  revalidatePath('/')
  revalidatePath('/admin/breaking-news')
}
