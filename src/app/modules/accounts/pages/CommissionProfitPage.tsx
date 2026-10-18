import React, { useCallback, useState } from 'react';
import { FormField, inputClasses, PageHeader, SliderDrawer } from '@/shared';
import { useApp } from '@/app/providers';
import { useToast } from '@/shared/components/Toast';
import { useCommissionProfit } from '../hooks/useCommissionProfit';
import { CommissionProfitPresenter } from './presenters/CommissionProfitPresenter';
import type { CreateCommissionProfitPayload } from '../types/commission-profit.types';
interface FormState {
    yearId: number;
    monthId: number;
    commissionAmount: number;
    receivedDate: string;
}
const emptyForm = (): FormState => ({
    yearId: new Date().getFullYear(),
    monthId: new Date().getMonth() + 1,
    commissionAmount: 0,
    receivedDate: new Date().toISOString().slice(0, 10)
});
export const CommissionProfitPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const toast = useToast();
    const { records, isLoading, error, refetch, create, isCreating, createError } = useCommissionProfit(selectedBranch);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const setField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
        setForm((current) => ({ ...current, [field]: value }));
    const openCreate = useCallback(() => {
        setForm(emptyForm());
        setIsOpen(true);
    }, []);
    const submit = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            const payload: CreateCommissionProfitPayload = {
                id: null,
                shop_id: Number(selectedBranch),
                year_id: form.yearId,
                month_id: form.monthId,
                commission_amount: form.commissionAmount,
                is_received_commission: 1,
                received_date: form.receivedDate
            };
            try {
                await create(payload);
                setIsOpen(false);
                toast.success('Commission received successfully.');
            } catch (submitError) {
                toast.error(submitError instanceof Error ? submitError.message : 'Failed to save commission receipt.');
            }
        },
        [create, form, selectedBranch, toast]
    );
    return (
        <>
            <CommissionProfitPresenter
                records={records}
                isLoading={isLoading}
                error={error}
                createError={createError}
                onOpenCreate={openCreate}
                onRefetch={() => void refetch()}
            />
            <SliderDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} width="max-w-lg">
                <SliderDrawer.Header onClose={() => setIsOpen(false)}>
                    <PageHeader variant="flat" withAccent={false} className="min-w-0 flex-1 py-0">
                        <PageHeader.Header title="Receive Commission" description="Record a shop commission receipt" />
                    </PageHeader>
                </SliderDrawer.Header>
                <SliderDrawer.Body>
                    <form id="commission-form" onSubmit={submit} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Year" required>
                                <input
                                    type="number"
                                    min="2000"
                                    value={form.yearId}
                                    onChange={(event) => setField('yearId', Number(event.target.value))}
                                    className={inputClasses}
                                    required
                                />
                            </FormField>
                            <FormField label="Month" required>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={form.monthId}
                                    onChange={(event) => setField('monthId', Number(event.target.value))}
                                    className={inputClasses}
                                    required
                                />
                            </FormField>
                        </div>
                        <FormField label="Commission Amount" required>
                            <input
                                type="number"
                                min="0"
                                value={form.commissionAmount}
                                onChange={(event) => setField('commissionAmount', Number(event.target.value))}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Received Date" required>
                            <input
                                type="date"
                                value={form.receivedDate}
                                onChange={(event) => setField('receivedDate', event.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </form>
                </SliderDrawer.Body>
                <SliderDrawer.Footer>
                    <div className="flex justify-start gap-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold dark:border-slate-700">
                            Cancel
                        </button>
                        <button
                            form="commission-form"
                            type="submit"
                            disabled={isCreating}
                            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
                            {isCreating ? 'Saving...' : 'Save Commission'}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </>
    );
};
export default CommissionProfitPage;
