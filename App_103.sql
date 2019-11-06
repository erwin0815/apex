-- create DB Objects 

-------------------------------------------------------------------------------------------
drop table KB_GROUP ;
drop sequence KB_GROUP_SEQ ;
create  sequence KB_GROUP_SEQ ;

drop table KB_BOXES ;
drop sequence KB_BOXES_SEQ ;
create  sequence KB_BOXES_SEQ ;
create  sequence KB_BOXES_RF_SEQ ;

drop table KB_ITEMS ;
drop sequence KB_ITEMS_SEQ ;
create  sequence KB_ITEMS_SEQ ;





-------------------------------------------------------------------------------------------
  CREATE TABLE "KB_GROUP" 
   (	"ID" NUMBER NOT NULL ENABLE, 
	"TITLE" VARCHAR2(200 CHAR) NOT NULL ENABLE, 
	"ICON" VARCHAR2(200 CHAR), 
	"TOOLTIP" VARCHAR2(200 CHAR), 
	"CREATION" DATE default sysdate, 
	 CONSTRAINT "KB_GROUP_PK" PRIMARY KEY ("ID")
  ;

  CREATE OR REPLACE TRIGGER "KB_GROUP_TRG" 
   before insert on "KB_GROUP" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select KB_GROUP_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
end;

/
ALTER TRIGGER "KB_GROUP_TRG" ENABLE;

-------------------------------------------------------------------------------------------
INSERT INTO "KB_GROUP" (TITLE, ID) VALUES ('DWHADMINHT', 1) ;
INSERT INTO "KB_GROUP" (TITLE, ID) VALUES ('MEULLER', 2) ;
COMMIT;
-------------------------------------------------------------------------------------------


  CREATE TABLE "KB_BOXES" 
   (	"ID" NUMBER NOT NULL ENABLE, 
	"TEXT" VARCHAR2(200 CHAR), 
	"HEADERLINE" VARCHAR2(200 CHAR), 
	"ICON" VARCHAR2(200 CHAR), 
	"TOOLTIP" VARCHAR2(200 CHAR), 
	"CREATION" DATE default sysdate, 
	"GROUP_ID" NUMBER NOT null, 
	"FLAG_DELETED" NUMBER DEFAULT 0, 
	"REIHENFOLGE" NUMBER, 
	 CONSTRAINT "KB_BOXES_PK" PRIMARY KEY ("ID")
    ,CONSTRAINT "KB_GROUP_FK" FOREIGN KEY ("GROUP_ID")
	   REFERENCES "KB_GROUP" ("ID") ON DELETE CASCADE ENABLE
   )  ;

 CREATE OR REPLACE TRIGGER "KB_BOXES_TRG" 
   before insert on "KB_BOXES" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select KB_BOXES_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
      if :NEW."REIHENFOLGE" is null then 
         select KB_BOXES_RF_SEQ.nextval into :NEW."REIHENFOLGE" from dual; 
      end if; 
   end if; 
end;
/
ALTER TRIGGER "KB_BOXES_TRG" ENABLE;
-------------------------------------------------------------------------------------------

	
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Backlog','Buntes Sammelsorium',1);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Plan','wird umgesetzt',1);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Develop','ist aktiv',1);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('QS','zumtesten',1);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Done','ist rum',1);

Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Wishes','ohne Worte',2);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Backlog','Buntes Sammelsorium',2);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Plan','wird umgesetzt',2);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Develop','ist aktiv',2);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('QS','zumtesten',2);
Insert into KB_BOXES (TEXT,HEADERLINE,GROUP_ID) values ('Done','ist rum',2);
COMMIT;

-------------------------------------------------------------------------------------------



  CREATE TABLE "KB_ITEMS" 
   (	"ID" NUMBER NOT NULL ENABLE, 
	"TEXT" VARCHAR2(200 CHAR), 
	"ICON" VARCHAR2(200 CHAR), 
	"TOOLTIP" VARCHAR2(200 CHAR), 
	"CREATION" DATE default sysdate, 
	"BOX_ID" NUMBER NOT null,    
	 CONSTRAINT "KB_ITEMS_PK" PRIMARY KEY ("ID")
    ,CONSTRAINT "KB_BOX_FK" FOREIGN KEY ("BOX_ID")
	   REFERENCES "KB_BOXES" ("ID") ON DELETE CASCADE ENABLE
   )  ;

  CREATE OR REPLACE TRIGGER "KB_ITEMS_TRG" 
   before insert on "KB_ITEMS" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select KB_ITEMS_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
end;


/
ALTER TRIGGER "KB_ITEMS_TRG" ENABLE;
					   
-------------------------------------------------------------------------------------------
/*
	htgl.itemlists2 = [
						{"id":"1","text":"Item 0a","ul_number":1}
	                   ,{"id":"2","text":"Item 1a","ul_number":1}
	                   ,{"id":"3","text":"Item 2a","ul_number":1}
	                   ,{"id":"4","text":"Item 3a","ul_number":1}
	                   ,{"id":"5","text":"Item 5","ul_number":1}
					   ,{"id":"6","text":"Item 6","ul_number":2}
	                   ,{"id":"7","text":"Item 7","ul_number":2}
	                   ,{"id":"8","text":"Item 8","ul_number":2}
	                   ,{"id":"9","text":"Item 9","ul_number":2}
	                   ,{"id":"10","text":"Item 10","ul_number":2}
					   ,{"id":"11","text":"Item 11","ul_number":3}
	                   ,{"id":"12","text":"Item 12","ul_number":3}
	                   ,{"id":"13","text":"Item 13","ul_number":3}
	                   ,{"id":"14","text":"Item 14","ul_number":4}
	                   ,{"id":"15","text":"Item 15b","ul_number":5}
					   ]; 
*/
					   
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',1);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',1);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',1);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',1);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',1);

Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',2);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',2);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',2);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',2);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',2);

Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',3);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',3);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',3);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',3);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Item',3);
COMMIT;
update KB_ITEMS set TEXT = TEXT||'_'||to_char(id) ;
commit;

Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',6);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',6);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',6);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',6);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',6);

Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',7);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',7);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',7);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',7);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',7);

Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',9);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',9);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',9);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',9);
Insert into KB_ITEMS (TEXT,BOX_ID) values ('My_Next_Item',9);
COMMIT;
update KB_ITEMS set TEXT = TEXT||'_'||to_char(BOX_ID)||'_'||to_char(id) ;
commit;

-------------------------------------------------------------------------------------------
-- Added Flag Deleted für eine historie 

alter table kb_group add flag_deleted number default 0 ;
alter table kb_boxes add flag_deleted number default 0 ;
alter table kb_items add flag_deleted number default 0 ;

-------------------------------------------------------------------------------------------

  CREATE TABLE "KB_ITEMS_HIST" 
   (	"ID" NUMBER NOT NULL ENABLE, 
	"TEXT" VARCHAR2(200 CHAR), 
	"ICON" VARCHAR2(200 CHAR), 
	"TOOLTIP" VARCHAR2(200 CHAR), 
	"UPDATED" DATE DEFAULT sysdate, 
	"BOX_ID" NUMBER NOT NULL ENABLE, 
	"FLAG_DELETED" NUMBER
   );
-------------------------------------------------------------------------------------------
 CREATE OR REPLACE TRIGGER "KB_ITEMS_TRG" 
   before insert or update on "KB_ITEMS" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select KB_ITEMS_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
   if updating then 
      insert into KB_ITEMS_HIST (ID,TEXT,BOX_ID,FLAG_DELETED)
      VALUES( :OLD."ID",:OLD."TEXT",:OLD."BOX_ID",:OLD."FLAG_DELETED");
      
   end if; 
end;
/
ALTER TRIGGER "KB_ITEMS_TRG" ENABLE;
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
   