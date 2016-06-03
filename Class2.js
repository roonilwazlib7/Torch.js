/* Class 2.0 */

/*
* any object can be transformed into a Class
* usage:
* object = object.Class( ?optional type string? );
* ?optional inheritance? object.Inherits(otherClass);
*/

//heres how it's done:



var Class2 = function(object, Type)
{

    var _cls = object.Constructor ? object.Constructor : function(){};

    var cls = _cls.prototype;
    _cls.Static = cls;


    if (Type) cls.type = Type;

    for (var key in object)
    {
        cls[key] = object[key];
    }

    _cls.Inherits = function(otherClass)
    {
        //other class must be abstract
        if (!otherClass.ABSTRACT)
        {
            throw "Class Error: Inherited Class must be abstract!";
        }
        cls.Base = new otherClass();
        //cls.Base.child = cls;

        for (key in otherClass)
        {
            if (!cls[key] && key != "ABSTRACT" && key != "Constructor")
            {
                cls[key] = otherClass[key];
            }
        }
    };
    _cls.Extend = function(otherClass)
    {
        //copies anyt class into a new class
        //class will not be given a base to access the 'otherClass'

        var keys = otherClass.Static ? otherClass.Static : otherClass;

        for (key in keys)
        {
            if (key != "ABSTRACT" && key != "Constructor")
            {
                cls[key] = keys[key];
            }
        }
    };
    _cls.Abstract = function()
    {
        _cls.ABSTRACT = true;

        cls.This = function()
        {
            return this.child;
        };
    }

    return _cls;
}

Function.prototype.Construct = function(instance)
{
    if (instance.Base) instance.Base.child = instance;
};

// var DATA =
// {
//     c0: 0,
//     c1: 0.1,
//     c2: 0.01
// }
//
// //new way
// //abstract class
// //a little funky
// //instead of:
// //var that = this
// //inside functions,
// //use var that = this.This();
// var AbstractCounter =
// {
//     _count: 0,
//     _times: 0,
//
//     inc: function()
//     {
//         var that = this.This();
//         that._count += 2;
//     }
// };
// AbstractCounter = Class(AbstractCounter, "Counter");
// AbstractCounter.Abstract();
//
// //here's an example:
// var Counter =
// {
//     _count:0,
//
//     Constructor: function(initialCount)
//     {
//         this.Construct(this);
//         this._count = initialCount;
//     },
//
//     inc: function()
//     {
//         var that = this;
//         that._count++;
//     },
//
//     dec: function()
//     {
//         var that = this;
//         that._count--;
//     },
//
//     count: function()
//     {
//         var that = this;
//         return that._count;
//     }
// }
// Counter = Class(Counter, "Counter");
// Counter.Inherits(AbstractCounter)
// Counter.Extend(DATA);
//
// //here's an equivelent Counter class the old way
// // var Counter = new Class(function(initialCount)
// // {
// //     ;"Counter";
// //     this._count = initialCount;
// // });
// //
// // Counter.Inherits(AbstractCounter);
// //
// // Counter.Prop("_count", 0);
// // Counter.Prop("inc", function()
// // {
// //     var that = this;
// //     that._count++;
// // });
// // Counter.Prop("dec", function()
// // {
// //     var that = this;
// //     that._count--;
// // });
// // Counter.Prop("count", function()
// // {
// //     var that = this;
// //     return that._count;
// // });
//
//
//
// Data = {};
// Data.Raw = {};
// Data.Raw.Units = {};
//
// Data.Units = {};
//
//
// Data.Raw.Units.Goblins =
// {
//     "Race":
//     {
//
//     },
//     "Units":
//     [
//         {
//             "name": "GoblinBruiser",
//             "health": 10,
//             "moveRange": 3,
//             "attackRange": 6,
//             "power": 30,
//             "strength": 20,
//
//         },
//         {
//             "name": "GoblinRusher",
//             "health": 10,
//             "moveRange": 3,
//             "attackRange": 1,
//             "power": 30,
//             "strength": 10,
//         }
//     ]
// }
//
// LoadUnitData = function(jsonObject)
// {
//     jsonObject.Units.forEach(function(unit)
//     {
//         Data.Units[unit.name] = unit;
//     });
// }
