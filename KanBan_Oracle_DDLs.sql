--------------------------------------------------------
--  DDL for Sequence KB_BOXES_RF_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "KB_BOXES_RF_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Sequence KB_BOXES_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "KB_BOXES_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Sequence KB_GROUP_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "KB_GROUP_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Sequence KB_ITEMS_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "KB_ITEMS_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
--------------------------------------------------------
--  DDL for Table KB_BOXES
--------------------------------------------------------

  CREATE TABLE "KB_BOXES" 
   (	"ID" NUMBER, 
	"TEXT" VARCHAR2(200 CHAR), 
	"HEADERLINE" VARCHAR2(200 CHAR), 
	"ICON" VARCHAR2(200 CHAR), 
	"TOOLTIP" VARCHAR2(200 CHAR), 
	"CREATION" DATE DEFAULT sysdate, 
	"GROUP_ID" NUMBER, 
	"FLAG_DELETED" NUMBER DEFAULT 0, 
	"REIHENFOLGE" NUMBER
   ) ;
--------------------------------------------------------
--  DDL for Table KB_GROUP
--------------------------------------------------------

  CREATE TABLE "KB_GROUP" 
   (	"ID" NUMBER, 
	"TITLE" VARCHAR2(200 CHAR), 
	"ICON" VARCHAR2(200 CHAR), 
	"TOOLTIP" VARCHAR2(200 CHAR), 
	"CREATION" DATE DEFAULT sysdate, 
	"FLAG_DELETED" NUMBER DEFAULT 0
   ) ;
--------------------------------------------------------
--  DDL for Table KB_ITEMS
--------------------------------------------------------

  CREATE TABLE "KB_ITEMS" 
   (	"ID" NUMBER, 
	"TEXT" VARCHAR2(200 CHAR), 
	"ICON" VARCHAR2(200 CHAR), 
	"TOOLTIP" VARCHAR2(200 CHAR), 
	"CREATION" DATE DEFAULT sysdate, 
	"BOX_ID" NUMBER, 
	"FLAG_DELETED" NUMBER DEFAULT 0, 
	"TASK" VARCHAR2(200 BYTE), 
	"MYCHECK" VARCHAR2(200 CHAR), 
	"MYFIX" DATE
   ) ;
--------------------------------------------------------
--  DDL for Table KB_ITEMS_HIST
--------------------------------------------------------

  CREATE TABLE "KB_ITEMS_HIST" 
   (	"ID" NUMBER, 
	"TEXT" VARCHAR2(200 CHAR), 
	"ICON" VARCHAR2(200 CHAR), 
	"TOOLTIP" VARCHAR2(200 CHAR), 
	"UPDATED" DATE DEFAULT sysdate, 
	"BOX_ID" NUMBER, 
	"FLAG_DELETED" NUMBER, 
	"TASK" VARCHAR2(200 BYTE)
   ) ;
--------------------------------------------------------
--  DDL for Index KB_GROUP_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "KB_GROUP_PK" ON "KB_GROUP" ("ID") 
  ;
--------------------------------------------------------
--  DDL for Index KB_ITEMS_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "KB_ITEMS_PK" ON "KB_ITEMS" ("ID") 
  ;
--------------------------------------------------------
--  DDL for Index KB_BOXES_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "KB_BOXES_PK" ON "KB_BOXES" ("ID") 
  ;
--------------------------------------------------------
--  DDL for Trigger KB_BOXES_TRG
--------------------------------------------------------

  CREATE OR REPLACE EDITIONABLE TRIGGER "KB_BOXES_TRG" 
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
--------------------------------------------------------
--  DDL for Trigger KB_GROUP_TRG
--------------------------------------------------------

  CREATE OR REPLACE EDITIONABLE TRIGGER "KB_GROUP_TRG" 
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
--------------------------------------------------------
--  DDL for Trigger KB_ITEMS_TRG
--------------------------------------------------------

  CREATE OR REPLACE EDITIONABLE TRIGGER "KB_ITEMS_TRG" 
   before insert or update on "KB_ITEMS" 
   for each row 
begin  
   if inserting then 
      if :NEW."ID" is null then 
         select KB_ITEMS_SEQ.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
   if updating then 
      insert into KB_ITEMS_HIST (ID,TEXT,TASK,BOX_ID,FLAG_DELETED)
      VALUES( :OLD."ID",:OLD."TEXT",:OLD."TASK",:OLD."BOX_ID",:OLD."FLAG_DELETED");

   end if; 
end;
/
ALTER TRIGGER "KB_ITEMS_TRG" ENABLE;
--------------------------------------------------------
--  Constraints for Table KB_BOXES
--------------------------------------------------------

  ALTER TABLE "KB_BOXES" ADD CONSTRAINT "KB_BOXES_PK" PRIMARY KEY ("ID")
  USING INDEX  ENABLE;
  ALTER TABLE "KB_BOXES" MODIFY ("GROUP_ID" NOT NULL ENABLE);
  ALTER TABLE "KB_BOXES" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table KB_GROUP
--------------------------------------------------------

  ALTER TABLE "KB_GROUP" ADD CONSTRAINT "KB_GROUP_PK" PRIMARY KEY ("ID")
  USING INDEX  ENABLE;
  ALTER TABLE "KB_GROUP" MODIFY ("TITLE" NOT NULL ENABLE);
  ALTER TABLE "KB_GROUP" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table KB_ITEMS_HIST
--------------------------------------------------------

  ALTER TABLE "KB_ITEMS_HIST" MODIFY ("BOX_ID" NOT NULL ENABLE);
  ALTER TABLE "KB_ITEMS_HIST" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table KB_ITEMS
--------------------------------------------------------

  ALTER TABLE "KB_ITEMS" ADD CONSTRAINT "KB_ITEMS_PK" PRIMARY KEY ("ID")
  USING INDEX  ENABLE;
  ALTER TABLE "KB_ITEMS" MODIFY ("BOX_ID" NOT NULL ENABLE);
  ALTER TABLE "KB_ITEMS" MODIFY ("ID" NOT NULL ENABLE);
-------------------------------------------------------------
-- HT Second PART
-------------------------------------------------------------


create sequence KB_Berechtigungen_seq ;
  CREATE TABLE  "KB_BERECHTIGUNGEN" 
   (	"ID" NUMBER NOT NULL ENABLE, 
	"USERNAME" VARCHAR2(200 CHAR) NOT NULL ENABLE, 
	"CREATION" DATE DEFAULT sysdate, 
	"ROLE_ID" NUMBER DEFAULT 0, 
	"FLAG_DELETED" NUMBER DEFAULT 0, 
	"GRP_ID" NUMBER, 
	 CONSTRAINT "KB_BERECHTG_PK" PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
   ;

  CREATE OR REPLACE EDITIONABLE TRIGGER  "KB_Berechtigungen_TRG" 
  BEFORE INSERT ON  KB_Berechtigungen
  REFERENCING FOR EACH ROW
  begin  
   if inserting then 
      if :NEW."ID" is null then 
         select KB_Berechtigungen_seq.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
end;



/
ALTER TRIGGER  "KB_Berechtigungen_TRG" ENABLE;
------------------------------------------------------------
create sequence KB_ROLES_seq ;

  CREATE TABLE  "KB_ROLES" 
   (	"ID" NUMBER NOT NULL ENABLE, 
	"ROLENAME" VARCHAR2(200 CHAR) NOT NULL ENABLE, 
	"CREATION" DATE DEFAULT sysdate, 
	"FLAG_DELETED" NUMBER DEFAULT 0, 
	 CONSTRAINT "KB_ROLES_PK" PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
   ENABLE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
   ;

  CREATE OR REPLACE EDITIONABLE TRIGGER  "KB_ROLES_TRG" 
  BEFORE INSERT ON  KB_ROLES
  REFERENCING FOR EACH ROW
  begin  
   if inserting then 
      if :NEW."ID" is null then 
         select KB_ROLES_seq.nextval into :NEW."ID" from dual; 
      end if; 
   end if; 
end;



/
ALTER TRIGGER  "KB_ROLES_TRG" ENABLE;

REM INSERTING into SMT_OWNER.KB_ROLES
SET DEFINE OFF;
Insert into KB_ROLES (ROLENAME,FLAG_DELETED) values ('Nothing','0');
Insert into KB_ROLES (ROLENAME,FLAG_DELETED) values ('Reading','0');
Insert into KB_ROLES (ROLENAME,FLAG_DELETED) values ('Writing','0');
commit;
