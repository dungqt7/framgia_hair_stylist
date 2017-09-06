

var labels = {
    labelDate:[],
    labelMonth:[],
    labelYear:[]
};

Vue.component("bar-chart-day", {
    extends: VueChartJs.Bar,
    props: ["data1", "options"],
    computed: {
        chartData: function() {
            return this.data1;
        },
    },

    data: function () {
        return labels;
    }, 

    methods: {
        renderLineChart: function() {
            var dataInDataSets = [];
            for (var i = 0; i < this.chartData.statistical.length; i++) {
                labels.labelDate.push(this.chartData.statistical[i].label);
                dataInDataSets.push(this.chartData.statistical[i].value);
            }   
            this.renderChart(
            {
                labels:labels.labelDate,
                datasets: [
                {
                    label: ['Sales'],
                    backgroundColor: "red",
                    data: dataInDataSets
                },
                ]
            },
            { responsive: false, maintainAspectRatio: false }
            );    
        }
    },
    watch: {
        data1: function() {
        this.renderLineChart();
    }
}
})

Vue.component('bar-chart-month', {
    extends: VueChartJs.Bar,
    props: ["data2", "options"],

    computed: {
        chartData: function() {
            return this.data2;
        },
    },

    data: function () {
        return labels;
    }, 

    methods: {
        renderLineChart: function() {
            var dataInDataSets = [];
            for (var i = 0; i < this.chartData.statistical.length; i++) {
                labels.labelMonth.push(this.chartData.statistical[i].label);
                dataInDataSets.push(this.chartData.statistical[i].value);
            }
            this.renderChart(
            {
                labels:labels.labelMonth,
                datasets: [
                {
                    label: ['Sales'],
                    backgroundColor: "red",
                    data: dataInDataSets
                },
                ]
            },
            { responsive: false, maintainAspectRatio: true }
            ); 
            this.update();     
        }
    },
    watch: {
        data2: function() {
          this.renderLineChart();
        }
    }
})

Vue.component('bar-chart-year', {
    extends: VueChartJs.Bar,
    props: ["data3", "options"],

    computed: {
        chartData: function() {
            console.log(this.data3);
            return this.data3;
        },
    },

    data: function () {
        return labels;
    }, 

    methods: {
        renderLineChart: function() {
            var dataInDataSets = [];
            for (var i = 0; i < this.chartData.statistical.length; i++) {
                labels.labelYear.push(this.chartData.statistical[i].label);
                dataInDataSets.push(this.chartData.statistical[i].value);
            }
            this.renderChart(
            {
                labels:labels.labelYear,
                datasets: [
                {
                    label: ['Sales'],
                    backgroundColor: "red",
                    data: dataInDataSets
                },
                ]
            },
            { responsive: false, maintainAspectRatio: true }
            ); 
            this.update();      
        }
    },
    watch: {
        data3: function() {
          this.renderLineChart();
        }
    }
})

var vm = new Vue({
    el: ".content-wrapper",

    data:{
        users: {},
        token: {},
        filterParams: {'type': '', 'start_date': '', 'end_date': ''},
        inputDate: {'start_date': '', 'end_date': ''},
        inputMonth: {'start_date': '', 'end_date': ''},
        inputYear: {'start_date': '', 'end_date': ''},
        dataChartDay: { 
            'label': '',
            'value': ''
        },
        dataChartMonth: { 
            'label': '',
            'value': ''
        },
        dataChartYear: { 
            'label': '',
            'value': ''
        },
    },
    mounted : function(){
        this.users = Vue.ls.get('user', {});
        this.token = Vue.ls.get('token', {});

        var curentDateTimeStamp = new Date().getTime() / 1000 | 0;
        var curentDateString = new Date().toISOString().slice(0, 10);

        this.filterParams.type = "day";
        this.filterParams.start_date = curentDateTimeStamp - 604800;
        this.filterParams.end_date = curentDateTimeStamp;

        this.inputDate.start_date = new Date(this.filterParams.start_date*1000).toISOString().slice(0, 10);;
        this.inputDate.end_date = curentDateString;


        this.ChartSales();
    },
    methods: {
        ChartSales: function() {
            var self = this;
            var authOptions = {
                method: 'get',
                url: '/api/v0/report-sales',
                params: this.filterParams,
                headers: {
                    'Authorization': "Bearer " + this.token.access_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                json: true
            }
            axios(authOptions).then(response => {
                if(this.filterParams.type == "day")
                {
                    this.$set(this, "dataChartDay", response.data.data);
                }
                else if(this.filterParams.type == "month")
                {
                    this.$set(this, "dataChartMonth", response.data.data);
                }
                else
                {
                    this.$set(this, "dataChartYear", response.data.data);
                }
                
            })
        },

        selectTypeMonth: function(event) {
            this.filterParams.type = "month";
            var currentYear = new Date().getFullYear();
            var currentMonth = new Date().getMonth();
            console.log(new Date().getMonth());
            if(currentMonth <=9)
            {
                currentMonth = "0" + currentMonth;
            }
            this.filterParams.start_date = moment("01/15/" + currentYear).unix();
            this.filterParams.end_date = moment(currentMonth + "/15/" + currentYear).unix();


            this.inputMonth.start_date =currentYear + "-" + "01-15"; 
            this.inputMonth.end_date = currentYear + "-" + currentMonth + "-" + "15";

            this.ChartSales();
        },

        selectTypeDay: function(event) {

            this.filterParams.type = "day";

        },

        selectTypeYear: function(event) {
            this.filterParams.type = "year";
            var currentYear = new Date().getFullYear();
            var currentMonth = new Date().getMonth();
            if(currentMonth <=9)
            {
                currentMonth = "0" + currentMonth;
            }
            this.filterParams.start_date = moment("01/15/" + currentYear).unix();
            this.filterParams.end_date = moment(currentMonth + "/15/" + currentYear).unix();

            this.inputYear.start_date =currentYear + "-" + "01-15";
            this.inputYear.end_date = currentYear + "-" + currentMonth + "-" + "15";

            this.ChartSales();
        },

        selectStartDay: function(event) {
            labels.labelDate = [];
            labels.labelMonth = [];
            labels.labelYear = [];
            var timestamp = new Date(event.target.value).getTime() / 1000 | 0;
            this.filterParams.start_date = timestamp;
            this.ChartSales();
        },

        selectEndDay: function(event) {
            labels.labelDate = [];
            labels.labelMonth = [];
            labels.labelYear = [];

            var timestamp = new Date(event.target.value).getTime() / 1000 | 0;
            this.filterParams.end_date = timestamp;
            this.ChartSales();
        },
    }
});
