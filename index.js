import http from 'http';
import mongoose from 'mongoose';
import { responseHeader as header } from './integration/config';
import { httpMethod, errorMessage } from './integration/enum';
import {
	getHttpResponseText,
	getHttpRequestBody,
	getUrlPostId,
} from './integration/util';
import {
	getPosts,
	postOnePost,
	patchPost,
	deletePosts,
	deletePost,
} from './integration/main';
import 'dotenv/config';

const baseUrl = '/posts';
const dbUrl = process.env.DATABASE_URL.replace(
	'<password>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(dbUrl)
	.then(() => {
		console.log('資料庫連線成功');
	})
	.catch((e) => {
		console.log(e.reason);
	});

const requestListener = async (request, response) => {
	const { url, method } = request;
	let statusCode = 200;
	let responseText = '';

	switch (true) {
	// 取得全部貼文
	case method === httpMethod.GET && url === baseUrl:
		responseText = getHttpResponseText({ data: await getPosts() });
		break;
		// 新增貼文
	case method === httpMethod.POST && url === baseUrl:
		try {
			const post = await postOnePost(await getHttpRequestBody(request));
			responseText = getHttpResponseText({ data: post });
		} catch (message) {
			statusCode = 400;
			responseText = getHttpResponseText({ success: false, data: message });
		}
		break;
		// 編輯特定的貼文
	case method === httpMethod.PATCH && url.startsWith(`${baseUrl}/`):
		try {
			const updatedPost = await patchPost({
				postId: getUrlPostId(url),
				payload: await getHttpRequestBody(request),
			});
			responseText = getHttpResponseText({ data: updatedPost  });
		} catch (message) {
			statusCode = 400;
			responseText = getHttpResponseText({ success: false, data: message });
		}
		break;
		// 刪除全部貼文
	case method === httpMethod.DELETE && url === baseUrl:
		await deletePosts();
		responseText = getHttpResponseText();
		break;
		// 刪除指定的代辦事項
	case method === httpMethod.DELETE && url.startsWith(`${baseUrl}/`):
		try {
			await deletePost(getUrlPostId(url));
			responseText = getHttpResponseText();
		} catch (message) {
			statusCode = 400;
			responseText = getHttpResponseText({
				success: false,
				data: message,
			});
		}
		break;
	case method === httpMethod.OPTIONS:
		break;
	default:
		statusCode = 404;
		responseText = getHttpResponseText({
			success: false,
			data: errorMessage.router,
		});
		break;
	}

	response.writeHead(statusCode, header);
	response.write(responseText);
	response.end();
};

const server = http
	.createServer(requestListener)
	.listen(process.env.PORT || 3005);

console.log('Server is up and running');

export default server;
