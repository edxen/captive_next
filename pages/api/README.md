Captive Portal Next
Stacks: HTML5, CSS-in-JS, TypeScript, NextJS, ExpressJS

Render of Captive Portal that runs on actual API

---
#### Site API
Description: to control display in captive portal
```
{
    login_options: {
        authentication: boolean;
        access_code: boolean;
        }
    },
    bill_plans?: [
        	{
    	    uuid: string;
    		plan_name: string;
    	    duration: number; [minutes]
    		type: string; [free, prepaid, voucher]
    		amount: number;
        },
        ...
    ],
    signed_in: {
        status: boolean;
        guest?: {
            full_name: string;
            first_name: string;
            last_name: string;
            code: string;
        }
    },
    connected?: {
        status: boolean;
        bill_plan?: {
    		plan_name: string;
    	    duration: number; [minutes]
    		type: string; [free, prepaid, voucher]
    		amount: number;
		}
    }
}
```


#### PMS API
 Description: to check / verify guest records
```
[
    {  
        uuid: string;
        room_number: number;
        full_name: string;
        first_name: string;
        last_name: string;
        code: string;
    },
    ...
]
```

#### Access Code API
 Description: to check / verify access code list
```
[
    {
        uuid: number;
        access_code: string;
        bill_plan: string;
    },
    ...
]
```

#### Bill Plans API
Description: list of available bill plans
```
[
	{
	    uuid: string;
		plan_name: string;
	    duration: number; [minutes]
		type: string; [free, prepaid, voucher]
		amount: number;
    }
]
```

#### Submit API
Description: to run when credentials are submitted, will compare submit data against PMS records
```
{
    room_number: number;
    last_name: string;
}
```