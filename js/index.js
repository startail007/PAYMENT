window.onload = function() {

	var root = {
		template: '#template_root'
	};
	var payProcess = {
		template: '#template_payProcess',
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
		}
	};
	var step1 = {
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
	        	agree:""
			}
		},
		template: '#template_step1',
		methods: {
			next:function(){
				var payTypeContent = this.$refs.payTypeContent;
				var that = this;
				payTypeContent.$validator.validateAll().then(function(result0) {
		        	that.$validator.validateAll().then(function(result1) {
			        	console.log(result0,result1)
			       	});
		       	});									
			}
		}
	};
	var step1_creditCard = {
		data:function(){
			return {
				creditCard0:"",
				creditCard1:"",
				creditCard2:"",
				creditCard3:"",
				creditCardTerm0:"",
				creditCardTerm1:""
			}
		},
		template: '#template_step1_creditCard',
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
	var step2 = { template: '#template_step2'};	
	var step3 = { template: '#template_step3' };
	var step3_finish = { template: '#template_step3_finish' };
	var step3_shop = { template: '#template_step3_shop' };

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
			component: payProcess,
			meta: {
				title:''
			},
			children:[
				{
					path: 'step1',
					component: step1,
					meta: {
						title:'步驟1'
					},
					children:[
						{
							path: 'creditCard',
							name : 'creditCard',
							component: step1_creditCard 
						},
						{
							path: 'shop',
							name : 'shop',
							component: step1_shop 
						},
					]
				},
				{ 
					path: 'step2',
					component: step2,
					meta: {
						title:'步驟2',
					}
				},
				{ 
					path: 'step3',
					component: step3,
					meta: {
						title:'步驟3'
					},
					children:[
						{
							path: 'finish',
							component: step3_finish 
						},
						{
							path: 'shop',
							component: step3_shop 
						}
					]
				}
			]
		},		
	];

	var router = new VueRouter({
		routes:routes
	});

	router.beforeEach(function(to, from, next){
		//console.log(to, from, next);
		console.log(to, from);
		if (to.meta.requireAuth) {
	        /*if (token) {
	            next();
	        } else {*/
	            /*next({
	                path: '/step1',
	                query: {
	                    redirect: to.fullPath
	                }
	            });*/
	        //}
	        next(false);
	    } else {
	        next();
	    }
	});
	Vue.use(Vuex);
	/*VeeValidate.Validator.extend('agree', {
	  	validate: function(value){
	  		return false;
	  	}
	});*/
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
			}		    
		},
		mutations: {
		}
	})



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