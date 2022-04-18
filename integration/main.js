/**
 * 主要的程式邏輯
 */
import Post from '../models/post';
import { errorMessage } from './enum';

/**
 * 取得全部貼文
 * @returns {array}
 */
export const getPosts = async () => await Post.find().sort({ createdAt: -1 });

/**
 * 新增貼文
 * @param {string} payload 傳入參數
 */
export const postOnePost = async (payload) => {
	try {
		const { userName,userPhoto  } = JSON.parse(payload);
		const post = await Post.create({userName,userPhoto});
		return post;
	} catch (error) {
		return Promise.reject(error);
	}
};

/**
 * 編輯特定的貼文
 * @param {string} postId 貼文編號
 * @param {string} payload 傳入參數
 */
export const patchPost = async ({ postId, payload }) => {
	try {
		const post = Post.findById(postId);
		console.log(post);
		if (!(post && postId)) throw errorMessage.format;

		await Post.findByIdAndUpdate(postId, JSON.parse(payload));
		return await Post.findById(postId);
	} catch (error) {
		return Promise.reject(error);
	}
};

/**
 * 刪除全部貼文
 */
export const deletePosts = async () => {
	await Post.deleteMany({});
};

/**
 * 刪除指定的貼文
 * @param {string} postId 貼文編號
 */
export const deletePost = async (postId) => {
	try {
		const post = Post.findById(postId);
		if (!(post && postId)) throw errorMessage.format;
		await Post.findByIdAndDelete(postId);
	}
	catch (error) {
		return Promise.reject(error);
	}
};
