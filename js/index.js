window.onload = function() {
	var orderInfo = {
		template: '#template_orderInfo',
		data:function(){
			return {				
				active:false
			}
		},
		computed: {
		  	orderInfo:function(){
		  		return this.$store.state.orderInfo;
	    	},
        	totalAmount:function(){
        		return this.orderInfo.list.map(function(el){
        			return el.count*el.amount;
        		}).reduce(function(accumulator, currentValue){
        			return accumulator + currentValue;
        		});
        	}
		},
		methods: {
			orderInfoButton_click:function(){
				this.active = !this.active;
			}
		}
	};
	var stepNav = {		
		template: '#template_stepNav',
		props: {
			step: {type: Number,default: -1}
		},
		data:function(){
			return {				
				stepList:[
					{title:"STEP.1",subTitle:"選擇支付方式"},
					{title:"STEP.2",subTitle:"確認訂購資訊"},
					{title:"STEP.3",subTitle:"支付成功"}
				]
			}
		}
	}
	var root = {
		template: '#template_root',
		components: {
			orderInfo:orderInfo
		},
		methods: {
			pay:function(){
		       	this.$router.push('/payProcess/step1');	
			}
		}
	};	
	var payProcess = {
		template: '#template_payProcess',
		data:function(){
			return {				
				step:-1
			}
		},
		components: {
			orderInfo:orderInfo,
			stepNav:stepNav
		},
		watch:{
			"$route":function(){
				this.updateStep();
			}
		},
		mounted: function() {
			this.updateStep();
        },
        methods: {
        	updateStep:function(){
        		this.step = this.$route.meta.step;
        	}
        }
	};	
	var step1_creditCard = {		
		template: '#template_step1_creditCard',
		data:function(){
			return {
				creditCard0:"",
				creditCard1:"",
				creditCard2:"",
				creditCard3:"",
				creditCardTerm0:"",
				creditCardTerm1:"",
				creditCardSecurityCode:""
			}
		},
	    computed:{
	    	creditCard:function(){
	    		return this.creditCard0 + this.creditCard1 + this.creditCard2 + this.creditCard3;
	    	},	
	    	creditCardTerm:function(){
	    		return this.creditCardTerm0 + this.creditCardTerm1;
	    	}    	
		}
	};
	var step1_shop = { template: '#template_step1_shop' };
	var step1 = {		
		template: '#template_step1',
		components: {
			creditCard:step1_creditCard,
			shop:step1_shop
		},
		data:function(){
			return {
				payTypeList:[
	        		{title:"信用卡付款",value:"creditCard"},
	        		{title:"超商付款",value:"shop"}
	        	],
	        	identity:"anonymous",
	        	name:"",
	        	email:"",
	        	promotionCode:"",
	        	agree:false
			}
		},
		methods: {
			prev:function(){
				this.$router.push('/');
			},
			next:function(){
				//console.log(this.$validator)
				var that = this;
				//console.log(payTypeContent)
				that.$validator.validateAll("main").then(function(result1) {
		        	that.$validator.validate("promotionCode").then(function(result2) {
						var payTypeContent = that.$refs.payTypeContent;
		        		if(payTypeContent){
			        		payTypeContent.$validator.validateAll("main").then(function(result0) {
					        	//console.log(result0,result1,result2);
					        	if(result0&&result1){
						        	var userInfo = {
							       		identity:that.identity,
							       		name:that.name,
							       		email:that.email,
							       		promotionCode:(that.promotionCode!==""&&result2)?that.promotionCode:""
							       	};
							       	that.$store.commit('setUserInfo', userInfo);		       	
							       	if(that.$route.params.type==="creditCard"){
							       		var payInfo = {
							       			creditCard:payTypeContent.creditCard,
							       			creditCardTerm:payTypeContent.creditCardTerm,
							       			creditCardSecurityCode:payTypeContent.creditCardSecurityCode
							       		}	
							       		that.$store.commit('setPayInfo', payInfo);	       		
							       	}
							       	that.$router.push('/payProcess/step2/' + that.$route.params.type);
					        	}

					       	});	
				       	}        	
			       	});
		       	});	
		       	
		       	
		       								
			}
		}
	};	
	var step2_creditCard = {
		template: '#template_step2_creditCard',
		methods: {
	    	creditCardWithCommas:function(x) {
	    		if(!x){
	    			return "";
	    		}
			    return x.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
			},
			creditCardTermWithCommas:function(x) {
				if(!x){
	    			return "";
	    		}
			    return x.toString().replace(/\B(?=(\d{2})+(?!\d))/g, "/");
			}
		},
		computed: {
		  	payInfo:function(){
		  		return this.$store.state.payInfo;
	    	}
	    }
	};
	var step2_shop = { template: '#template_step2_shop' };
	var step2 = {
		template: '#template_step2',
		components: {
			creditCard:step2_creditCard,
			shop:step2_shop
		},
		methods: {
			prev:function(){
		       	this.$router.push('/payProcess/step1/' + this.$route.params.type);	
			},
			next:function(){	
				var step3map = {
					creditCard:'finish',
					shop:'shop'
				}
		       	this.$router.push('/payProcess/step3/'+step3map[this.$route.params.type]);						
			}
		},
		computed: {
		  	userInfo:function(){
		  		return this.$store.state.userInfo;
	    	}
	    }
	};	
	var step3_finish = { template: '#template_step3_finish' };
	var step3_shop = { template: '#template_step3_shop' };
	var step3 = {
		template: '#template_step3',
		components: {
			finish:step3_finish,
			shop:step3_shop
		},
		methods: {
			go:function(){
		       	this.$router.push('/');	
			}
		}
	};

	var routes = [
		{
			path: '/',
			component: root,
			meta: {
				title:''
			}
		},
		{
			path: '/payProcess',
			redirect: '/payProcess/step1',
			component: payProcess,
			meta: {
				title:''
			},
			children:[
				{
					path: 'step1/:type?',
					component: step1,
					meta: {
						title:'步驟1',
						step:0
					}
				},
				{ 
					path: 'step2/:type?',
					component: step2,
					meta: {
						title:'步驟2',
						step:1
					}
				},
				{ 
					path: 'step3/:type?',
					component: step3,
					meta: {
						title:'步驟3',
						step:2
					}/*,
					children:[
						{
							path: 'finish',
							component: step3_finish 
						},
						{
							path: 'shop',
							component: step3_shop 
						}
					]*/
				}
			]
		},		
	];

	var router = new VueRouter({
		routes:routes
	});

	/*router.beforeEach(function(to, from, next){
		//console.log(to, from, next);
		console.log(this,to, from);
		if (to.meta.requireAuth) {
	        next(false);
	    } else {
	        next();
	    }
	});*/	
	Vue.use(Vuex);
	//console.log(axios.get)


	Vue.use(VeeValidate, {
		locale: 'zh_TW',
		dictionary: {
			'zh_TW': {
				messages: {
				  	required: function(field){
				     	return '此區域須填寫';
				   	},
				   	email: function(field) {
				     	return '格式無效';
				   	},
				   	min: function(field,value) {
				     	return '不能小於' + value[0] + '個字元';
				   	},
				   	digits: function(field,value) {
				     	return '不能小於' + value[0] + '個數字';
				   	},
				   	credit_card:function(field) {
				     	return '請輸入正確';
				   	},
				   	date_format:function(field) {
				     	return '請輸入正確';
				   	},
				   	numeric:function(field) {
				     	return '只能輸入數字';
				   	},
				   	alpha_num:function(field) {
				     	return '只能輸入字母或數字';
				   	}
				},
				attributes:{
					name:"姓名",
					email:"電子郵件",
					creditCard:"信用卡卡號",
					creditCardTerm:"信用卡期限",
					creditCardSecurityCode:"信用卡背後安全碼",
					promotionCode:"優惠代碼"
				},
				custom: {
					type: {
				    	required: '須選擇'
				    },
				    agree: {
				    	required: '須同意'
				    },
				    promotionCode: {
				    	min:function(field,value) {
				     		return '需輸入' + value[0] + '個字元';
				   		}
				   	}
				}
			}
		}
	});

	VeeValidate.Validator.extend('promotionCode', {
		getMessage: function(field, params, data){
			return "優惠碼無效";
		},
	  	validate: function(value){
	  		/*做異步驗證*/
		    var promise = new Promise(function(resolve, reject) {
				setTimeout(function(){
					if(value==="12345678"){
						resolve(true);
					}else{
						resolve(false);
					}
				}, 1000);
			});
		    return promise;
	  	}
	});

	var store = new Vuex.Store({
		state: {
			orderInfo:{
				list:[
					{
						name:"Iphone XS 手機殼",
						count:1,
						amount:600
					}
				],
				order:17485739
			},
			userInfo:{
			},
			payInfo:{
			}		    
		},
		mutations: {
			setUserInfo:function(state,data){
				state.userInfo = data;
			},
			setPayInfo:function(state,data){
				state.payInfo = data;
			}
		}
	});

	



	var app = new Vue({
        el: '#app',
        router:router,
        store:store,
	  	components: {
	  	},
        data: {
        },
        mounted: function() {
        	//console.log(this.$store)
        },
        /*created: function() {
  			console.log(this.$validator.extend);
  		},*/
        watch:{
        	
        },
        methods: {
		},
	    computed:{	    	
		}
    });
}