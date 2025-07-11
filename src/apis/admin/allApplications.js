import { railwayBaseUrl } from "../../utils";

async function fetchAllApplications() {
    try {
        const token = localStorage.getItem('bolt_visa_token');
        const res = await fetch(`${railwayBaseUrl}/application?page=1&limit=10`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.message || 'Failed to fetch applications' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

async function deleteApplication(id) {
    try {
        const token = localStorage.getItem('bolt_visa_token');
        const res = await fetch(`${railwayBaseUrl}/applications/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.message || 'Failed to delete application' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

async function addApplication(applicationData) {
    try {
        const token = localStorage.getItem('bolt_visa_token');
        const res = await fetch(`${railwayBaseUrl}/application/create-applicaiton`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(applicationData),
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.message || 'Failed to add application' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

async function applicationStatus(statusData) {
    try {
        const token = localStorage.getItem('bolt_visa_token');
        const res = await fetch(`${railwayBaseUrl}/application/update-application-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(statusData),
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.message || 'Failed to update application status' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

async function editApplication(id, updates) {
    try {
        const token = localStorage.getItem('bolt_visa_token');
        const res = await fetch(`${railwayBaseUrl}/application/update-application?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.message || 'Failed to edit application' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

export { fetchAllApplications, deleteApplication, addApplication, applicationStatus, editApplication }; 