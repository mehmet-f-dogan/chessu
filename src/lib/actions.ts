"use server"

export async function completeContent(userId: string, contentId: string): Promise<void> {
    try {
        await fetch(`${process.env.CHESSU_BACKEND_API_URL}/completion/content/${contentId}/user/${userId}/complete`,
            {
                method: "POST",
                cache: "no-cache"
            })
    } catch (ignored) {
    }
}

export async function isCourseComplete(userId: string, courseId: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/completion/course/${courseId}/user/${userId}/verify`,
            {
                method: "GET",
                cache: "no-cache"
            })
        const body = await response.json()
        return body.verified ? true : false
    } catch (ignored) {
        return false
    }
}

export async function isChapterComplete(userId: string, chapterId: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/completion/chapter/${chapterId}/user/${userId}/verify`,
            {
                method: "GET",
                cache: "no-cache"
            })
        const body = await response.json()
        return body.verified ? true : false
    } catch (ignored) {
        return false
    }
}

export async function isContentComplete(userId: string, contentId: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/completion/content/${contentId}/user/${userId}/verify`,
            {
                method: "GET",
                cache: "no-cache"
            })
        const body = await response.json()
        return body.verified ? true : false
    } catch (ignored) {
        return false
    }
}

export async function isCoursePurchased(userId: string, courseId: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/purchase/course/${courseId}/user/${userId}/verify`,
            {
                method: "GET",
                cache: "no-cache"
            })
        if (!response.ok) {
            return false
        }
        const body = await response.json()
        return body.verified ? true : false
    } catch (ignored) {
        return false
    }
}

export async function getCoursePurchaseUrl(userId: string, courseId: string): Promise<string> {
    try {
        const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/purchase/course/${courseId}/user/${userId}/create-checkout-link`,
            {
                method: "Post",
                cache: "no-cache"
            })
        if (!response.ok) {
            return ""
        }
        const body = await response.json()
        return body.url as string
    } catch (ignored) {
        return ""
    }
}

export async function getCoursePrice(userId: string, courseId: string): Promise<number> {
    try {
        const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/price/course/${courseId}/user/${userId}`,
            {
                method: "GET",
                cache: "no-cache"
            })
        if (!response.ok) {
            return 0
        }
        const body = await response.json()
        return body.price as number
    } catch (ignored) {
        return 0
    }
}

interface UserHomepageCoursesResponseItem {
    course_id: string;
    completion: number;
}

export interface UserHomepageCoursesResponse {
    CourseResponses: UserHomepageCoursesResponseItem[];
}

export async function loadMyCourses(userId: string): Promise<UserHomepageCoursesResponse> {
    try {
        const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/homepage/user/${userId}/courses`,
            {
                method: "GET",
                cache: "no-cache"
            })
        const body = await response.json()
        return body
    } catch (ignored) {
        return { CourseResponses: [] }
    }
}

export async function cancelMembership(userId: string): Promise<void> {
    await fetch(`${process.env.CHESSU_BACKEND_API_URL}/membership/${userId}/cancel`,
        {
            method: "POST",
            cache: "no-cache"
        })
}

export async function isUserMember(userId: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/membership/${userId}/verify`,
            {
                method: "GET",
                cache: "no-cache"
            })
        const body = await response.json()
        return body.verified ? true : false
    } catch (ignored) {
        return false
    }
}

export async function getCheckoutLink(userId: string): Promise<string> {
    const response = await fetch(`${process.env.CHESSU_BACKEND_API_URL}/membership/${userId}/create-checkout-link`,
        {
            method: "POST",
            cache: "no-cache"
        })
    if (!response.ok) {
        return ""
    }
    return (await response.json()).url as string
}