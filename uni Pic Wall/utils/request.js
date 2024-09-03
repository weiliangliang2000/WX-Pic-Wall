export const url = 'https://paper.256923.xyz/'

export function request(config={}){
	let{
		url,
		data={},
		method="GET",  //默认为get
		header={}
	} = config
		
	return new Promise((resolve,reject)=>{
		uni.request({
			url:url,
			method:method,
			header:header,
			data:data,
			
			success:res=>{
				if(res.data.code===200){
					resolve(res.data)
				}else if(res.data.code===400){
					uni.showModal({
						title:"错误提示",
						content:res.data,
						showCancel:false	//关闭取消按钮
					})
					reject(res.data)
				}else{
					uni.showToast({
						title:res.data,
						icon:"none"
					})
					reject(res.data)
				}
			},
			fail:err=>{
				reject(err)
			}
		})
	})
}