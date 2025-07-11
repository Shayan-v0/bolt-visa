import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchApplications, addApplication } from '../store/applicationsSlice';
import { loadExpenses, addExpense } from '../store/expensesSlice';

const RTKTest = () => {
  const dispatch = useDispatch();
  const applications = useSelector(state => state.applications);
  const expenses = useSelector(state => state.expenses);
  const auth = useSelector(state => state.auth);

  const testFetchApplications = () => {
    dispatch(fetchApplications({ page: 1, limit: 10 }));
  };

  const testLoadExpenses = () => {
    dispatch(loadExpenses());
  };

  const testAddExpense = () => {
    const testExpense = {
      title: 'Test Expense',
      amount: '100',
      currency: 'AED',
      category: 'Test',
      description: 'Test expense for RTK',
      date: new Date().toISOString().split('T')[0],
      type: 'other',
      isRecurring: false,
      userId: 'test-user',
      userName: 'Test User'
    };
    dispatch(addExpense(testExpense));
  };

  return (
    <div className="p-6 space-y-4">
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">RTK Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Applications State</h3>
              <div className="text-sm text-purple-300">
                <p>Loading: {applications.loading ? 'Yes' : 'No'}</p>
                <p>Error: {applications.error || 'None'}</p>
                <p>Data Count: {applications.data.length}</p>
                <p>Page: {applications.page}</p>
              </div>
              <Button onClick={testFetchApplications} className="mt-2">
                Test Fetch Applications
              </Button>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Expenses State</h3>
              <div className="text-sm text-purple-300">
                <p>Loading: {expenses.loading ? 'Yes' : 'No'}</p>
                <p>Error: {expenses.error || 'None'}</p>
                <p>Data Count: {expenses.data.length}</p>
              </div>
              <div className="space-y-2 mt-2">
                <Button onClick={testLoadExpenses} className="w-full">
                  Test Load Expenses
                </Button>
                <Button onClick={testAddExpense} className="w-full">
                  Test Add Expense
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Auth State</h3>
              <div className="text-sm text-purple-300">
                <p>Loading: {auth.loading ? 'Yes' : 'No'}</p>
                <p>Error: {auth.error || 'None'}</p>
                <p>User: {auth.user ? 'Logged In' : 'Not Logged In'}</p>
                <p>Token: {auth.token ? 'Present' : 'None'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-white font-semibold mb-2">Recent Applications</h3>
            <div className="max-h-40 overflow-y-auto">
              {applications.data.slice(0, 5).map((app, index) => (
                <div key={index} className="text-sm text-purple-300 p-2 bg-purple-900/20 rounded mb-1">
                  {app.title || app.caseId || `Application ${index + 1}`}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-white font-semibold mb-2">Recent Expenses</h3>
            <div className="max-h-40 overflow-y-auto">
              {expenses.data.slice(0, 5).map((expense, index) => (
                <div key={index} className="text-sm text-purple-300 p-2 bg-purple-900/20 rounded mb-1">
                  {expense.title} - {expense.amount} {expense.currency}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RTKTest; 